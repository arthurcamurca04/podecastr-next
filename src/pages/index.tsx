//-> 3 formas para consumir uma API

//1 SPA useEffect() dentro do próprio React
//2 SSR - toda vez tem que ir na API buscar os dados
//3 SSG - ideal para conteúdos mais estáticos
import { GetStaticProps } from "next";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import api from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

type Episode = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  publishedAt: string;
};
type HomeProps = {
  episodes: Array<Episode>;
};
export default function Home(props: HomeProps) {
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
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      description: episode.description,
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      url: episode.file.url,
    };
  });

  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
