from fastapi import FastAPI
from pydantic import BaseModel
import re
import random
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Load and process the PDF
pdf_path = "interview_questions.pdf.pdf"  # Ensure correct file path
loader = PyPDFLoader(pdf_path)
data = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000)
docs = text_splitter.split_documents(data)

# Create vectorstore
vectorstore = Chroma.from_documents(
    documents=docs, 
    embedding=GoogleGenerativeAIEmbeddings(model="models/embedding-001")
)

retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 10})
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0, max_tokens=200, timeout=None)

# Define input model
class QueryRequest(BaseModel):
    job_role: str
    technology: str

def extract_questions_by_technology(text, technology):
    """Extracts questions only from the specified technology section."""
    pattern = rf"Technology:\s*{technology}\s*(.+?)(?=\nTechnology:|\Z)"  # Extract section
    match = re.search(pattern, text, re.DOTALL)
    
    if not match:
        print(f"⚠️ No section found for {technology}, using all available questions.")
        return extract_questions_from_text(text)  # Fallback to all questions
    
    section_text = match.group(1)  # Get only the relevant tech section
    return extract_questions_from_text(section_text)

def extract_questions_from_text(text):
    """Extracts questions from text without difficulty filtering."""
    pattern = r"(.+?)\s*\[\d\]"  # Matches "question [1]" format
    matches = re.findall(pattern, text)

    return [question.strip() for question in matches]

@app.post("/get_questions")
async def get_questions(query: QueryRequest):
    """Returns 5 interview questions from the PDF, strictly for the given technology."""
    
    # Use full document (not vector search) to extract questions
    document_text = " ".join([doc.page_content for doc in docs])  

    # Extract questions for the requested technology
    all_questions = extract_questions_by_technology(document_text, query.technology)

    # Select any 5 questions (randomly)
    selected_questions = random.sample(all_questions, min(5, len(all_questions)))  

    return {"questions": selected_questions}

class FeedbackRequest(BaseModel):
    question: str
    user_answer: str

@app.post("/generate_feedback")
async def generate_feedback(request: FeedbackRequest):
    """Generates AI-based feedback on the user's answer."""
    input_query = f"Provide feedback for the following question and user answer: {request.question}. User's answer: {request.user_answer}"

    # Retrieve relevant context
    retrieved_docs = retriever.invoke(input_query)
    context = " ".join([doc.page_content for doc in retrieved_docs])

    # System prompt
    system_prompt = (
        "You are an AI interview evaluator. Based on the retrieved context, "
        "evaluate the user's answer and provide feedback in a single response. "
        "Include a rating (out of 5) at the end of your feedback in this format: 'Rating: X/5'. "
        "Do NOT separate the rating as a JSON field. If context is insufficient, still provide a rating and feedback."
        "\n\nContext:\n{context}"
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}")
    ])

    # Run the RAG chain
    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)

    response = rag_chain.invoke({"input": input_query, "context": context})

    return {"feedback": response["answer"]}  # Feedback contains rating inside text
