import Card from '../../components/ui/card';

export default function Home() {
  return (
    <div className="bg-gray-800 font-sans">
      <div className="container mx-auto w-11/12">
        <ul id="cards" className="grid grid-cols-1 gap-x-[4vw] gap-y-[calc(var(--cards)*var(--cardTopPadding))] pb-[calc(var(--cards)*var(--cardTopPadding))] mb-[var(--cardMargin)]">
          <Card index="1" color="#52B2CF" title="Card 1" />
          <Card index="2" color="#E5A36F" title="Card 2" />
          <Card index="3" color="#9CADCE" title="Card 3" />
          <Card index="4" color="#D4AFB9" title="Card 4" />
        </ul>
      </div>
    </div>
  );
}
