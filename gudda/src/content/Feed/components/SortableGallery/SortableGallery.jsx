import { useRef, useState } from "react";

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import Sortable from "./Sortable";
import Overlay from "./Overlay";

import classes from "./SortableGallery.module.css";

export default function SortableGallery({
  gallery: Gallery,
  photos: photoSet,
  movePhoto,
  render,
  ...rest
}) {
  const ref = useRef(null);
  const [activePhoto, setActivePhoto] = useState();

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const photos = photoSet.map((photo) => ({ ...photo, id: photo.key ?? photo.src }));

  const handleDragStart = ({ active }) => {
    const photo = photos.find((item) => item.id === active.id);

    const image = ref.current?.querySelector(`img[src="${photo?.src}"]`);
    const padding = image?.parentElement ? getComputedStyle(image.parentElement).padding : undefined;
    const { width, height } = image?.getBoundingClientRect() || {};

    if (photo !== undefined && width !== undefined && height !== undefined) {
      setActivePhoto({ photo, width, height, padding });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      movePhoto(
        photos.findIndex((photo) => photo.id === active.id),
        photos.findIndex((photo) => photo.id === over.id),
      );
    }

    setActivePhoto(undefined);
  };

  const renderSortable = (
    Component,
    index,
    photo,
    props,
  ) => (
    <Sortable key={index} id={(photo).id}>
      <Component {...props} />
    </Sortable>
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      collisionDetection={closestCenter}
    >
      <SortableContext items={photos}>
        <div className={classes.gallery}>
          <Gallery
            ref={ref}
            photos={photos}
            render={{
              ...render,
              link: (props, { index, photo }) => renderSortable("a", index, photo, props),
              wrapper: (props, { index, photo }) => renderSortable("div", index, photo, props),
              button: (props, { index, photo }) => renderSortable("button", index, photo, props),
            }}
            {...rest}
          />
        </div>
      </SortableContext>

      <DragOverlay>{activePhoto && <Overlay className={classes.overlay} {...activePhoto} />}</DragOverlay>
    </DndContext>
  );
}
