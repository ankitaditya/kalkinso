
import '../Dashboard.scss';

const VideoTile = ({ url, title }) => {

    return (
        <div className="ratio ratio-16x9 mb-3">
            <iframe
            src={url}
            title={title}
            allowfullscreen
            ></iframe>
        </div>
    );
}

export default VideoTile;