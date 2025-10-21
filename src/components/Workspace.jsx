import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer, Line, Circle } from 'react-konva';
import useImage from 'use-image';

const FurniturePiece = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [img] = useImage(shapeProps.src);

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const offsetX = shapeProps.scaleX === -1 ? shapeProps.width : 0;

  return (
    <React.Fragment>
      <KonvaImage
        onClick={onSelect} onTap={onSelect} ref={shapeRef} {...shapeProps} image={img} draggable offsetX={offsetX}
        onDragEnd={(e) => {
          onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({ ...shapeProps, x: node.x(), y: node.y(), width: node.width() * scaleX, height: node.height() * scaleY, rotation: node.rotation() });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) { return oldBox; }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default function Workspace({
  stageRef, 
  imageUrl, furniture, setFurniture, selectedId, setSelectedId,
  mode, paintColor, wallPolygons, setWallPolygons, newPolygonPoints, setNewPolygonPoints
}) {
  const containerRef = useRef(null);
  const [image, status] = useImage(imageUrl);
  const [scaledSize, setScaledSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (status === 'loaded' && containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.offsetWidth - 32;
      const containerHeight = container.offsetHeight - 32;
      const imageAspectRatio = image.width / image.height;
      const containerAspectRatio = containerWidth / containerHeight;
      let newWidth, newHeight;
      if (imageAspectRatio > containerAspectRatio) {
        newWidth = containerWidth;
        newHeight = containerWidth / imageAspectRatio;
      } else {
        newHeight = containerHeight;
        newWidth = containerHeight * imageAspectRatio;
      }
      setScaledSize({ width: newWidth, height: newHeight });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, status, containerRef.current?.offsetWidth, containerRef.current?.offsetHeight]);

  const handleMouseDown = (e) => {
    if (mode === 'select') {
      const clickedOnEmpty = e.target === e.target.getStage() || e.target.hasName('room-image');
      if (clickedOnEmpty) { setSelectedId(null); }
      return;
    }

    if (mode === 'paint') {
      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();

      if (newPolygonPoints.length > 2 && isCloseToStart(pos, newPolygonPoints[0])) {
        const finishedPolygon = {
          points: newPolygonPoints,
          color: paintColor,
          id: Date.now().toString(),
        };
        setWallPolygons([...wallPolygons, finishedPolygon]);
        setNewPolygonPoints([]);
      } else {
        setNewPolygonPoints([...newPolygonPoints, pos]);
      }
    }
  };

  const isCloseToStart = (point1, point2) => {
    if (!point1 || !point2) return false;
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return (dx * dx + dy * dy) < 225; // radius of 15px
  };

  const flatPoints = newPolygonPoints.flatMap(p => [p.x, p.y]);

  return (
    <div ref={containerRef} className="flex-1 bg-slate-200 flex justify-center items-center p-4 overflow-auto">
      {imageUrl && status === 'loaded' ? (
        <Stage ref={stageRef} width={scaledSize.width} height={scaledSize.height} onMouseDown={handleMouseDown}>
          <Layer>
            <KonvaImage image={image} width={scaledSize.width} height={scaledSize.height} name="room-image" />
          </Layer>
          <Layer>
            {wallPolygons.map(poly => (
              <Line key={poly.id} points={poly.points.flatMap(p => [p.x, p.y])} fill={poly.color} opacity={0.5} closed listening={false} />
            ))}
            <Line points={flatPoints} stroke="black" strokeWidth={1} listening={false} />
            {newPolygonPoints.map((point, index) => (
              <Circle key={index} x={point.x} y={point.y} radius={index === 0 ? 6 : 4} fill={index === 0 ? 'red' : 'white'} stroke="black" strokeWidth={1} listening={false} />
            ))}
          </Layer>
          <Layer>
            {furniture.map((item) => (
              <FurniturePiece
                key={item.id} shapeProps={item} isSelected={item.id === selectedId}
                onSelect={() => { if (mode === 'select') setSelectedId(item.id); }}
                onChange={(newAttrs) => {
                  const updatedFurniture = furniture.map((furn) => (furn.id === newAttrs.id ? newAttrs : furn));
                  setFurniture(updatedFurniture);
                }}
              />
            ))}
          </Layer>
        </Stage>
      ) : (
         <div className="text-center">
          {imageUrl ? <p>Loading image...</p> : <p className="text-slate-600 font-semibold">Upload a room photo to begin</p>}
         </div>
      )}
    </div>
  );
}