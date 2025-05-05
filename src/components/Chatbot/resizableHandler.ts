type Direction = 'top' | 'right' | 'bottom' | 'left';

interface ResizeState {
  isResizing: boolean;
  direction: Direction | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startTop: number;
  startLeft: number;
}

const resizeState: ResizeState = {
  isResizing: false,
  direction: null,
  startX: 0,
  startY: 0,
  startWidth: 0,
  startHeight: 0,
  startTop: 0,
  startLeft: 0,
};

const initResize = (direction: Direction, event: MouseEvent) => {
  event.preventDefault();
  
  const container = document.querySelector('.rcb-chat-window') as HTMLElement;
  if (!container) return;

  resizeState.isResizing = true;
  resizeState.direction = direction;
  resizeState.startX = event.clientX;
  resizeState.startY = event.clientY;
  resizeState.startWidth = container.offsetWidth;
  resizeState.startHeight = container.offsetHeight;
  resizeState.startTop = container.offsetTop;
  resizeState.startLeft = container.offsetLeft;

  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
};

const handleResize = (event: MouseEvent) => {
  const container = document.querySelector('.rcb-chat-window') as HTMLElement;
  if (!container || !resizeState.isResizing || !resizeState.direction) return;

  const dx = event.clientX - resizeState.startX;
  const dy = event.clientY - resizeState.startY;

  switch (resizeState.direction) {
    case 'right':
      container.style.width = `${resizeState.startWidth + dx}px`;
      break;
    case 'bottom':
      container.style.height = `${resizeState.startHeight + dy}px`;
      break;
    case 'left':
      container.style.width = `${resizeState.startWidth - dx}px`;
      container.style.left = `${resizeState.startLeft + dx}px`;
      break;
    case 'top':
      container.style.height = `${resizeState.startHeight - dy}px`;
      container.style.top = `${resizeState.startTop + dy}px`;
      break;
  }
};

const stopResize = () => {
  resizeState.isResizing = false;
  resizeState.direction = null;
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
};

export const setupResizableDiv = () => {
  const container = document.querySelector('.rcb-chat-window') as HTMLElement;
  if (!container) return;

  const sides: Direction[] = ['top', 'right', 'bottom', 'left'];

  sides.forEach((side) => {
    const handle = document.createElement('div');
    handle.className = `resize-handle resize-${side}`;
    
    // Make the handle large enough
    handle.style.position = 'absolute';
    handle.style.zIndex = '10';
    handle.style.background = 'transparent'; // transparent (invisible but clickable)

    if (side === 'top' || side === 'bottom') {
      handle.style.height = '10px';
      handle.style.width = '100%';
      handle.style[side] = '-5px'; // half outside
      handle.style.left = '0';
      handle.style.cursor = side === 'top' ? 'n-resize' : 's-resize';
    } else {
      handle.style.width = '10px';
      handle.style.height = '100%';
      handle.style[side] = '-5px';
      handle.style.top = '0';
      handle.style.cursor = side === 'left' ? 'w-resize' : 'e-resize';
    }

    handle.addEventListener('mousedown', (e) => initResize(side, e));
    container.appendChild(handle);
  });
};