import { Suspense } from "react";
import MovieInfo, { getMovie } from "../../../../components/movie-info";
import MovieVideos from "../../../../components/movie-videos";

interface IParams {
  params: { id: string };
}

export async function generateMetadata({ params: { id } }: IParams) {
  const movie = await getMovie(id);
  return {
    title: movie.title,
  };
}

export default async function MovieDetailPage({ params: { id } }: IParams) {
  /*
  순차 실행이 아니라 병렬적으로 시행 시켜야하기 때문에 Promise.all()
  하지만 Promise.all은 movie데이터와 videoes 데이터가 둘 다 완료되어야 데이터를 가져오기 때문에
  각각 데이터의 ui변동을 원한다면 병렬적으로 분리시킬 필요가 있음
  const [movie, videos] = await Promise.all([getMovie(id), getVideos(id)]);
  return <h1>{movie.title}</h1>;
  */

  // 각각의 데이터 UI를 컴포넌트로 따로 분리한다. (둘 다 server component)
  // movie-info.tsx , movie-videos.tsx
  // 그리고 각각 Suspense로 감싸준다
  // * Suspense 컴포넌트는 async function으로 리턴하는 컴포넌트가 있을 시 사용함.
  // fallback을 props로 주면 await 완료 시 까지 로딩 컴포넌트 지정가능
  return (
    <div>
      <Suspense fallback={<h1>Loading movie info</h1>}>
        <MovieInfo id={id} />
      </Suspense>
      <Suspense fallback={<h1>Loading movie videos</h1>}>
        <MovieVideos id={id} />
      </Suspense>
    </div>
  );
}
