import { PopconfirmPosition } from './Popconfirm';

export const getPosition = (
  providedPosition: PopconfirmPosition,
  container: HTMLElement,
  anchor: HTMLElement,
  centerArrow?: boolean,
) => {
  const { top, left, height, width } = anchor.getBoundingClientRect();
  const position = { top: 0, left: 0 };

  switch (providedPosition) {
    case 'top':
    case 'topLeft':
    case 'topRight': {
      position.top = top - container.offsetHeight;
      break;
    }
    case 'bottom':
    case 'bottomLeft':
    case 'bottomRight': {
      position.top = top + height;
      break;
    }
    case 'left':
    case 'right': {
      position.top = top + height / 2 - container.offsetHeight / 2;
      break;
    }
    case 'leftTop':
    case 'rightTop': {
      if (centerArrow) {
        position.top = top + height / 2 - 16;
      } else {
        position.top = top;
      }
      break;
    }
    case 'leftBottom':
    case 'rightBottom': {
      if (centerArrow) {
        position.top = top - container.offsetHeight + height / 2 + 16;
      } else {
        position.top = top + height - container.offsetHeight;
      }
      break;
    }
    default: {
      position.top = 0;
    }
  }

  switch (providedPosition) {
    case 'top':
    case 'bottom': {
      position.left = left + width / 2 - container.offsetWidth / 2;
      break;
    }
    case 'topLeft':
    case 'bottomLeft': {
      if (centerArrow) {
        position.left = left + width / 2 - 20;
      } else {
        position.left = left;
      }
      break;
    }
    case 'topRight':
    case 'bottomRight': {
      if (centerArrow) {
        position.left = left + width / 2 - container.offsetWidth + 20;
      } else {
        position.left = left + width - container.offsetWidth;
      }
      break;
    }
    case 'left':
    case 'leftTop':
    case 'leftBottom': {
      position.left = left - container.offsetWidth;
      break;
    }
    case 'right':
    case 'rightTop':
    case 'rightBottom': {
      position.left = left + width;
      break;
    }
    default: {
      position.left = 0;
    }
  }

  return position;
};
