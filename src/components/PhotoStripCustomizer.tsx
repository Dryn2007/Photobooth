import React, { useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import html2canvas from "html2canvas";

interface Photo {
  id: number;
  dataUrl: string;
}

interface Props {
  initialPhotos: Photo[];
}

const PhotoStripCustomizer: React.FC<Props> = ({ initialPhotos }) => {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [layout, setLayout] = useState<"2x3" | "3x2">("2x3");
  const previewRef = useRef<HTMLDivElement>(null);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(photos);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setPhotos(items);
  };

  const handleDownload = async () => {
    if (previewRef.current) {
      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "photo-strip-4r.png";
      link.click();
    }
  };

  const getGridStyle = () => {
    const [cols, rows] = layout === "2x3" ? [2, 3] : [3, 2];
    return {
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gap: "10px",
      width: "1200px",
      height: "1800px",
      background: "white",
      padding: "20px",
      boxSizing: "border-box",
    };
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            name="layout"
            value="2x3"
            checked={layout === "2x3"}
            onChange={() => setLayout("2x3")}
          />
          Layout 2 x 3
        </label>
        <label>
          <input
            type="radio"
            name="layout"
            value="3x2"
            checked={layout === "3x2"}
            onChange={() => setLayout("3x2")}
          />
          Layout 3 x 2
        </label>
      </div>

      <div
        ref={previewRef}
        style={{ border: "2px solid #ccc", ...getGridStyle() }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="photos" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ display: "contents" }}
              >
                {photos.map((photo, index) => (
                  <Draggable
                    key={photo.id.toString()}
                    draggableId={photo.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          overflow: "hidden",
                          width: "100%",
                          height: "100%",
                          background: "#fff",
                        }}
                      >
                        <img
                          src={photo.dataUrl}
                          alt={`Photo ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          crossOrigin="anonymous"
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download PNG 4R
      </button>
    </div>
  );
};

export default PhotoStripCustomizer;
