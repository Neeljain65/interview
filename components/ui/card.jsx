const Card = ({ index, color, title }) => {
    return (
      <li className={`card sticky top-0 pt-[calc(${index}*var(--cardTopPadding))]`}>
        <div className={`card-body bg-[${color}] box-border p-8 rounded-[50px] shadow-[0_0_30px_0_rgba(0,0,0,0.3)] h-[var(--cardHeight)] flex justify-center items-center transition-all duration-500`}>
          <h2 className="text-4xl">{title}</h2>
        </div>
      </li>
    );
  };
  
  export default Card;
  