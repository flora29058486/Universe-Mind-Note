import React, { useState, useEffect, useRef } from 'react';
import { Layer, Text, Group, Arrow } from 'react-konva';
import { Html } from 'react-konva-utils';
import TextSettingToggleButton from './TextSettingToggleButton';

// Html usage example
{/* <Html
  transform // should we apply position transform automatically to DOM container, default is true
  transformFunc={(transformAttrs) => newAttrs} // function to overwrite transformation attributes, not used if transform = false, default is undefined
  groupProps={{}} // additional properties to the group wrapper, useful for some position offset
  divProps={{}} // additional props for wrapped div elements, useful for styles
>
  <div>DOM content</div>
</Html>; */}

// Portal usage example
// {/* <Layer>
//   <Portal selector=".top">
//     {/* content of that portal will be moved into "top" group*/}
//     <Rect width={100} height={100} fill="red" draggable />
//   </Portal>
//   <Rect width={100} height={100} fill="black" draggable />
//   <Group name="top" />
// </Layer> */}

const ImageTextLayer = ({ texts, arrows, currentTextId, onUpdateText, onUpdateArrow, onDeleteText }) => {
  const [editingId, setEditingId] = useState(null);
  const [isEditingText, setIsEditingText] = useState(false);
  const [isToggleToolFocus, setIsToggleToolFocus] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (currentTextId) {
      setEditingId(currentTextId);
    }
  }, [currentTextId]);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const handleDeleteText = (isDel) => {
    if (isDel) {
      onDeleteText(editingId);
    }
  };

  const handleMouseEnter = (e) => {
    const stage = e.target.getStage()
    stage.container().style.cursor = 'pointer';
  };

  const handleMouseLeave = (e) => {
    const stage = e.target.getStage()
    stage.container().style.cursor = 'default';
  };

  const handleTextDbClick = (text, e) => {
    if (e.evt.button !== 0) return;
    const stage = e.target.getStage();
    // const pointerPosition = stage.getPointerPosition();
    setIsEditingText(true);
    setEditingId(text.id); 
  };

  const handleInputBlur = () => {
    setIsEditingText(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        setEditingId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    if (!isEditingText && !isToggleToolFocus) {
      setEditingId(null);
    };
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isToggleToolFocus, isEditingText]);

  const handleTextPropsChange = (props, newvalue) => {
    // console.log("change", props, newvalue);
    onUpdateText(editingId, { [props]: newvalue });
  };

  const handleArrowPropsChange = (id, newvalue) => {
    onUpdateArrow(id, { ['points']: newvalue });
  };

  const handleToggleToolFoucs = (isFocus) => {
    setIsToggleToolFocus(isFocus);
  };

  return (
    <Layer>
      {texts.map((text) => (
        <Group key={text.id} name='TextGroup'>
          <Text
            id={text.id}
            name='Text'
            x={text.x}
            y={text.y}
            text={editingId === text.id ? '' : text.text} // 当编辑时隐藏 Konva 文本
            fontSize={text.fontSize || 20}
            fill={text.fill || 'black'}
            align={text.align || 'left'}
            draggable
            onDragEnd={(e) => {
              e.cancelBubble = true;
              onUpdateText(text.id, { x: e.target.x(), y: e.target.y() });
            }}
            // onClick={(e) => handleTextClick(text, e)}
            onDblClick={(e) => handleTextDbClick(text, e)}
            onMouseEnter={(e) => handleMouseEnter(e)}
            onMouseLeave={(e) => handleMouseLeave(e)}
          />
          {editingId === text.id && (
            <Html>
              <div 
                style={{
                  position: 'absolute',
                  top: text.y,
                  left: text.x,
                  transform: `translateY(-${text.fontSize / 5}rem)`,
                  // transform: `translateY(-4rem)`,
                }}
              >
                <TextSettingToggleButton
                  textProps={{ align: text.align, fontSize: text.fontSize, fill: text.fill }}
                  onTextPropsChange={handleTextPropsChange}
                  isFocus={handleToggleToolFoucs}
                  onDelText={handleDeleteText}
                />
                <input
                  ref={inputRef}
                  style={{ fontSize: text.fontSize || 20 }}
                  onChange={(e) => onUpdateText(text.id, { text: e.target.value })}
                  defaultValue={text.text}
                  onBlur={handleInputBlur}
                />
              </div>
            </Html>
          )}
        </Group>
      ))}
      {arrows.map((arrow) => {
        return (
          <Group key={arrow.id} name='ArrowGroup'>
            <Arrow
              id={arrow.id}
              name='Arrow'
              points={[arrow.points[0], arrow.points[1], arrow.points[2], arrow.points[3]]}
              strokeWidth={arrow.strokeWidth || 3}
              fill={arrow.fill || 'black'} // 同上
              stroke={arrow.stroke || 'black'} // 同上
              hitStrokeWidth={15}
              pointerLength={10}
              pointerWidth={10}
              draggable
              perfectDrawEnabled={false}
              onDragEnd={(e) => {
                e.cancelBubble = true;
                const newPosition = {x: e.target.position().x, y: e.target.position().y};
                  // 更新 points，將原始點轉移到新位置
                const newPoints = e.target.points().map((point, index) => {
                  return index % 2 === 0 ? point + newPosition.x : point + newPosition.y;
                });

                // 設置新的 points
                handleArrowPropsChange(arrow.id, newPoints);
                e.target.position({ x: 0, y: 0 });
                e.target.getLayer().batchDraw();
              }}
              onMouseEnter={(e) => handleMouseEnter(e, arrow)}
              onMouseLeave={(e) => handleMouseLeave(e, arrow)}
            />
          </Group>
        );
      })
      }
    </Layer>
  );
};

export default ImageTextLayer;
