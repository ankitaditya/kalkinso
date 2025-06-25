import '../Dashboard.scss';

const ImageTile = ({ link, title }) => {

    return (
        <img
            src={link}
            className="img-fluid rounded mb-3"
            alt={title}
        />
    );
}

export default ImageTile;