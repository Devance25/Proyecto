class DragDropController {
  constructor() {
    this.activeElement = null;
    this.dragState = {
      startX: 0,
      startY: 0,
      dx: 0,
      dy: 0
    };
    
    this.config = {
      resetTransition: 'transform 0.1s ease-out',
      selectors: {
        draggables: '.menu_partida .dinosaurio',
        dropzones: '.recinto:not(.bloqueado)'
      }
    };

    this.init();
  }

  init() {
    document.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    document.addEventListener('pointermove', this.handlePointerMove.bind(this));
    document.addEventListener('pointerup', this.handlePointerUp.bind(this));
    
    document.addEventListener('dragstart', e => {
      if (e.target.matches(this.config.selectors.draggables)) {
        e.preventDefault();
      }
    });
  }

  handlePointerDown(e) {
    const target = e.target.closest(this.config.selectors.draggables);
    if (!target) return;

    e.preventDefault();
    this.startDrag(target, e);
  }

  handlePointerMove(e) {
    if (!this.activeElement) return;
    
    this.updateDragPosition(e);
  }

  handlePointerUp(e) {
    if (!this.activeElement) return;
    
    this.endDrag(e);
  }

  startDrag(element, e) {
    this.activeElement = element;
    element.setPointerCapture(e.pointerId);
    
    const rect = element.getBoundingClientRect();
    this.dragState.startX = e.clientX - this.dragState.dx;
    this.dragState.startY = e.clientY - this.dragState.dy;
    
    element.style.cursor = 'grabbing';
    element.style.zIndex = '1000';
    element.classList.add('dragging');
  }

  updateDragPosition(e) {
    if (!this.activeElement) return;

    this.dragState.dx = e.clientX - this.dragState.startX;
    this.dragState.dy = e.clientY - this.dragState.startY;
    
    this.activeElement.style.transform = `translate(${this.dragState.dx}px, ${this.dragState.dy}px)`;
  }

  endDrag(e) {
    const element = this.activeElement;
    if (!element) return;

    element.releasePointerCapture(e.pointerId);
    element.classList.remove('dragging');
    
    element.style.transition = this.config.resetTransition;
    element.style.transform = '';
    element.style.cursor = 'grab';
    element.style.zIndex = '';
    
    this.dragState.dx = 0;
    this.dragState.dy = 0;
    
    this.handleDrop(element, e);
    
    this.activeElement = null;
  }

  handleDrop(element, e) {
    const transitionHandler = () => {
      element.style.transition = '';
      
      const dropTarget = this.findDropTarget(e.clientX, e.clientY);
      if (dropTarget) {
        this.completeDrop(element, dropTarget);
      }
    };

    element.addEventListener('transitionend', transitionHandler, { once: true });
    setTimeout(() => {
      if (element.style.transition) {
        element.removeEventListener('transitionend', transitionHandler);
        transitionHandler();
      }
    }, 200);
  }

  findDropTarget(x, y) {
    const draggingElement = document.querySelector('.dragging');
    if (draggingElement) {
      draggingElement.style.pointerEvents = 'none';
    }
    
    const elementBelow = document.elementFromPoint(x, y);
    const dropTarget = elementBelow?.closest(this.config.selectors.dropzones);
    
    if (draggingElement) {
      draggingElement.style.pointerEvents = '';
    }
    
    return dropTarget;
  }

  completeDrop(element, dropTarget) {
    const boardSrc = element.dataset.boardSrc;
    if (boardSrc) {
      element.src = boardSrc;
    }
    dropTarget.appendChild(element);
    element.draggable = false;
    element.style.cursor = 'default';
    element.classList.remove('menu_partida');
    element.dispatchEvent(new CustomEvent('dinoDrop', {
      detail: { dropTarget, element },
      bubbles: true
    }));
  }

  resetDinosaur(element) {
    element.draggable = true;
    element.style.cursor = 'grab';
    element.style.transform = '';
    element.style.transition = '';
    element.style.zIndex = '';
    element.classList.remove('dragging');
  }

  destroy() {
    document.removeEventListener('pointerdown', this.handlePointerDown);
    document.removeEventListener('pointermove', this.handlePointerMove);
    document.removeEventListener('pointerup', this.handlePointerUp);
    this.activeElement = null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const dragDropController = new DragDropController();
  
  window.dragDropController = dragDropController;
});

document.head.appendChild(style);