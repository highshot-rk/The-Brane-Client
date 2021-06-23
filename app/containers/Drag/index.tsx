import React from 'react'
import { batch } from 'utils/scheduling'

const EVENT_HANDLER_OPTIONS = {
  passive: true,
  capture: true,
}

interface WrapperProps {
  dragging?: boolean;
  dragEnabled?: boolean;
  dragPos?: {
    x: number,
    y: number
  };
  dragId?: string;
  dragPosChanged?: (
    dragId: string,
    diffX: number,
    diffY: number,
    x: number,
    y: number
  ) => void;
  dragStopped?: (dragId: string) => void;
  detectDragOnly?: boolean;
  dragStarted?: (dragId: string, x: number, y: number) => void;
}

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export default function wrapWithDragHandler<P extends Object>(
  Component: React.ComponentClass<P>
  ) {
  type Props = Readonly<Omit<P & WrapperProps, 'mouseDown' | 'mouseMove'>>
  type State = {
    dragging: boolean,
  }

  class DragHandlers extends React.Component<Props, State> {
    mouseStart = { x: 0, y: 0 }
    isMouseDown: boolean = false
    prevMousePos: { x: number, y: number} = null

    static defaultProps = { 
      dragId: '0',
      dragEnabled: true
    }

    constructor (props: Props) {
      super(props)

      this.state = {
        dragging: props.dragging || false,
      }

      this.isMouseDown = props.dragging || false

      if (props.dragging) {
        this.mouseDown({
          pageX: props.dragPos.x,
          pageY: props.dragPos.y,
        }, true)
      }

      this.prevMousePos = {
        x: (props.dragPos && props.dragPos.x) || 0,
        y: (props.dragPos && props.dragPos.y) || 0,
      }
    }

    mouseDown = (e: {pageX: number, pageY: number}, force: boolean) => {
      if (
        (this.props && this.props.dragEnabled === false) ||
        (this.isMouseDown && !force)
      ) {
        return
      }

      this.isMouseDown = true
      this.mouseStart = {
        x: e.pageX,
        y: e.pageY,
      }
      document.body.addEventListener('mousemove', this.mouseMove, EVENT_HANDLER_OPTIONS)
      document.body.addEventListener('mouseup', this.mouseUp, EVENT_HANDLER_OPTIONS)
    }

    mouseMove = (e: MouseEvent) => {
      if (!this.isMouseDown) {
        return
      }

      if (this.state.dragging) {
        this.props.dragPosChanged(
          this.props.dragId,
          e.pageX - this.prevMousePos.x,
          e.pageY - this.prevMousePos.y,
          e.pageX,
          e.pageY
        )
      } else if (
        Math.abs(this.mouseStart.x - e.pageX) > 5 ||
        Math.abs(this.mouseStart.y - e.pageY) > 5
      ) {
        batch(() => {
          this.setState({
            dragging: true,
          })
          if (this.props.dragStarted) {
            this.props.dragStarted(this.props.dragId, e.pageX, e.pageY)
          }
          if (this.props.detectDragOnly) {
            this.cleanup()
          }
        })
      }

      this.prevMousePos = {
        x: e.pageX,
        y: e.pageY,
      }
    }
    cleanup = () => {
      this.isMouseDown = false
      document.body.removeEventListener('mousemove', this.mouseMove, EVENT_HANDLER_OPTIONS)

      this.setState({
        dragging: false,
      })
    }
    mouseUp = () => {
      const isDragging = this.state.dragging
      batch(() => {
        this.cleanup()

        if (isDragging && this.props.dragStopped) {
          this.props.dragStopped(this.props.dragId)
        }
      })
    }

    render () {
      return (
        <Component
          mouseDown={this.mouseDown}
          mouseMove={this.mouseMove}
          dragging={this.state.dragging}
          {...this.props as P}
        />
      )
    }

    componentWillUnmount () {
      document.body.removeEventListener('mousemove', this.mouseMove, true)
      document.body.removeEventListener('mouseup', this.mouseUp, true)
    }
  }

  return DragHandlers
}
