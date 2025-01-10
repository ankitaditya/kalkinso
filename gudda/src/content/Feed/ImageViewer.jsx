import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import SortableGallery from "./components/SortableGallery";
import { getPhotos } from "./components/photos";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// import optional lightbox plugins
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export default function ImageViewer({imgs}) {
  const [photos, setPhotos] = useState(getPhotos(imgs));
  const [index, setIndex] = useState(-1);

  return (
    <>
    <SortableGallery
      gallery={RowsPhotoAlbum}
      spacing={16}
      padding={10}
      photos={photos}
      movePhoto={(oldIndex, newIndex) => setPhotos(arrayMove(photos, oldIndex, newIndex))}
      onClick={({ index }) => setIndex(index)}
    />
    <Lightbox
        slides={photos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        // enable optional lightbox plugins
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />
    </>
  );
}
