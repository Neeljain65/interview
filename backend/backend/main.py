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

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://mocky-interview.vercel.app"  # Deployed frontend
    ],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

pdf_path = "interview_questions.pdf.pdf"  
loader = PyPDFLoader(pdf_path)
data = loader.load()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500)
# text_splitter.transform_documents()
docs = text_splitter.split_documents(data)

print(docs)
for doc in docs:
    doc.page_content = doc.page_content.replace("[1]", "Easy")
    doc.page_content = doc.page_content.replace("[2]", "Medium")
    doc.page_content = doc.page_content.replace("[3]", "Hard")
# Create vectorstore
vectorstore = Chroma.from_documents(
    documents=docs, 
    embedding=GoogleGenerativeAIEmbeddings(model="models/embedding-001")
)
print(docs)

retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 10})
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0, max_tokens=200, timeout=None)

# Define input model
class QueryRequest(BaseModel):
    job_role: str
    technology: str

def extract_questions_by_technology(text, technology):
    """Extracts questions only from the specified technology section."""
    pattern = rf"Technology:\s*{technology}\s*(.+?)(?=\nTechnology:|\Z)"  
    match = re.search(pattern, text, re.DOTALL)
    
    if not match:
        print(f"⚠️ No section found for {technology}, using all available questions.")
        return extract_questions_from_text(text)  
    
    section_text = match.group(1)  
    return extract_questions_from_text(section_text)

def extract_questions_from_text(text):
    """Extracts questions from text without difficulty filtering."""
    pattern = r"(.+?)\s*\[\d\]"  
    matches = re.findall(pattern, text)

    return [question.strip() for question in matches]

class QueryRequest(BaseModel):
    job_role: str
    technology: str
    experience:str

@app.post("/get_questions")
async def get_questions(query: QueryRequest):
    input_query = f"Interview questions for {query.job_role} related to {query.technology}. My experience is {query.experience}"
    
    system_prompt = (
        "You are an assistant that retrieves interview questions from the given document. "
        "Extract only the most relevant questions for the given job role and technology."
        "You should recommend questions based on user's experience level so that user feels confident and motivated."
        "Just provide the questions in a plain list format without mentioning technology, job role, or difficulty."

        "\n\n"
        "{context}"
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])

    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)

    response = rag_chain.invoke({"input": input_query})

    # ✅ Ensure `response["answer"]` is processed correctly
    if isinstance(response["answer"], list):  # If already a list
        formatted_questions = [{"question": q, "answer": "N/A"} for q in response["answer"]]
    else:
        # If response is a string, split into a list
        questions_list = response["answer"].split("\n")  
        formatted_questions = [{"question": q.strip(), "answer": "N/A"} for q in questions_list if q.strip()]

    return {"questions": formatted_questions}  


# @app.post("/get_questions")
# async def get_questions(query: QueryRequest):
#     """Returns 5 interview questions from the PDF, strictly for the given technology."""
    
  
#     document_text = " ".join([doc.page_content for doc in docs])  

#     all_questions = extract_questions_by_technology(document_text, query.technology)

    
#     selected_questions = random.sample(all_questions, min(5, len(all_questions)))  

#     return {"questions": selected_questions}

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
