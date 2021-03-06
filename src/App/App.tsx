import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import './app.scss'
import './nullstyles.scss'
const App = () => {
  const [arrUserPoint, setPoint]: [
    point[][],
    Dispatch<SetStateAction<point[][]>>
  ] = useState<point[][]>([[]])
  function setNewPoint(e: MouseEvent<HTMLCanvasElement>) {
    arrUserPoint[0].push({
      x: e.clientX,
      y: e.clientY,
      id: 0,
      wasChange: false,
    })
  }
  function CleanArr() {
    setPoint([[]])
  }
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef: { current: CanvasRenderingContext2D | null } = useRef(null)
  //TODO: rescale function
  //TODO: growth figure
  //TODO: mutate figure
  useEffect(() => {
    console.log('window.innerWidth', window.innerWidth)
    const canvas = canvasRef.current as HTMLCanvasElement
    canvas.width = window.innerWidth - window.innerWidth / 1000
    canvas.height = window.innerHeight - 150
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    context.lineCap = 'round'
    context.strokeStyle = 'black'
    context.lineWidth = 5
    contextRef.current = context
  }, [])
  interface vector {
    x: number
    y: number
  }
  interface point extends vector {
    id: number
    wasChange: boolean
  }
  function sortArrDownLeft(arr: point[][]) {
    return arr.map((value, index, arr) => {
      const currentArr = [...value]
      return currentArr.sort((a, b) => a.y - b.y || a.x - b.x)
    })
  }
  function findMinimumPoint(sortedArr: point[][]): point[] | [] {
    return sortedArr.reduce((prev, curr, ind, arr) => [...prev, curr[0]], [])
  }
  function mainPoint(arr: point[][]) {
    const sortedArr = sortArrDownLeft(arr)
    const arrStartPoint = findMinimumPoint(sortedArr)
    console.log(getDoubleArrPoints(arrStartPoint, sortedArr))
    startDraw(getDoubleArrPoints(arrStartPoint, sortedArr))
  }
  function createDoubleArr(count: number) {
    const arr: point[][] = []
    for (let index = 0; index < count; index++) {
      arr[index] = []
    }
    return arr
  }
  function getDoubleArrPoints(startedPoints: point[], arr: point[][]) {
    const arrOfPoints: point[][] = createDoubleArr(arr.length)
    const funcArr: point[][] = JSON.parse(JSON.stringify(arr))
    funcArr.forEach((value, index) => {
      const smth = getArrPoints(
        startedPoints[index],
        arr[index],
        constructVectorBy2Points(startedPoints[index], {
          x: startedPoints[index].x + 4,
          y: startedPoints[index].y,
          id: startedPoints[index].id,
          wasChange: startedPoints[index].wasChange,
        })
      )
      arrOfPoints[index].push(...smth)
      return value
    })
    return arrOfPoints
  }
  function getVectorLength(vector: vector) {
    return Math.sqrt(vector.x ** 2 + vector.y ** 2)
  }
  function getArrPoints(
    startedPoint: point,
    arr: point[],
    vector: vector
  ): point[] {
    //??????????
    const funcArr: point[] = JSON.parse(JSON.stringify(arr))
    //????????????
    let grad = -1.1
    const pointArr: point[] = []
    let nextVector: vector = { x: 0.001, y: 0 }
    //?????????? ?? ???????????????????? ????????????????
    let pointsWithEqualGrad: point = startedPoint
    funcArr.reduce((prev, curr) => {
      //???????????????? ??????????????
      const newVector = constructVectorBy2Points(startedPoint, curr)
      //???? ?????????????? ????????????
      if (newVector.x || newVector.y) {
        //???????????? ????????
        const cos =
          (vector.x * newVector.x + vector.y * newVector.y) /
          (Math.sqrt(vector.x ** 2 + vector.y ** 2) *
            Math.sqrt(newVector.x ** 2 + newVector.y ** 2))
        if (cos > grad) {
          grad = cos
          //??????????????????
          pointsWithEqualGrad = curr
          nextVector = newVector
        } else if (cos === grad) {
          //???????????????????? ?????????? ??????????????
          if (getVectorLength(newVector) > getVectorLength(nextVector)) {
            pointsWithEqualGrad = curr
            nextVector = newVector
          }
        }
      }
      return curr
    }, startedPoint)
    pointArr.push(pointsWithEqualGrad)
    if (pointsWithEqualGrad !== funcArr[0]) {
      const smth = getArrPoints(pointsWithEqualGrad, funcArr, nextVector)
      pointArr.push(...smth)
    }
    return pointArr
  }
  function constructVectorBy2Points(pointStart: point, pointEnd: point) {
    return {
      x: pointEnd.x - pointStart.x,
      y: pointEnd.y - pointStart.y,
    }
  }
  function startDraw(arr: point[][]) {
    if (contextRef.current) {
      arr.forEach((val, ind) => {
        console.log('ind', ind)
        contextRef.current?.beginPath()
        for (let index = 0; index < val.length; index++) {
          const xCoord = val[index].x
          const yCoord = val[index].y
          contextRef.current?.lineTo(xCoord, yCoord)
        }
        contextRef.current?.closePath()
        contextRef.current?.stroke()
        return val
      })
    }
  }
  function draw() {
    if (arrUserPoint[0].length > 1) {
      mainPoint(arrUserPoint)
      CleanArr()
    }
  }
  function drawPoint() {
    arrUserPoint.forEach((val) => {
      val.forEach((value) => {
        if (contextRef.current) contextRef.current.fillStyle = 'orange'
        contextRef.current?.fillRect(value.x - 5, value.y - 5, 10, 10)
        return value
      })
      return val
    })
  }
  function clear() {
    contextRef.current?.clearRect(0, 0, window.innerWidth, window.innerHeight)
  }
  return (
    <div>
      <canvas
        onMouseDown={(e) => {
          setNewPoint(e)
          drawPoint()
        }}
        ref={canvasRef}
      />
      <div
        style={{
          display: 'flex',
          width: '60vw',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <button onClick={draw}>build MVO</button>
        <button onClick={clear}>clear</button>
      </div>
    </div>
  )
}

export default App
