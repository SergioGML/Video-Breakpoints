import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import QuestionModal from "../components/QuestionModal/QuestionModal";


const Home = () => {

  return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <h1 className="mb-4 text-2xl font-bold">YouTube</h1>

        <VideoPlayer videoId="KPcHiQ0wpBw"/>
        <QuestionModal/>
      </div>
    );
};

export default Home;
