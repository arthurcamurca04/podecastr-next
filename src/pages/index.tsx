//-> 3 formas para consumir uma API

//1 SPA useEffect() dentro do próprio React
//2 SSR - toda vez tem que ir na API buscar os dados
//3 SSG - ideal para conteúdos mais estáticos

export default function Home(props) {
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  );
}

//export async function getServerSideProps() {
//const response = await fetch("http://localhost:3333/episodes");
//const data = await response.json();
//return {
// props: {
//  episodes: data,
//},
//};
//}
export async function getStaticProps() {
  const response = await fetch("http://localhost:3333/episodes");
  const data = await response.json();
  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  };
}
