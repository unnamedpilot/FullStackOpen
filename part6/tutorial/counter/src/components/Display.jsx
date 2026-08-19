import {useCounter} from '../store'

const Viewer = () => {
    const count = useCounter()

    return (
        <>{count}</>
    )
}

export default Viewer