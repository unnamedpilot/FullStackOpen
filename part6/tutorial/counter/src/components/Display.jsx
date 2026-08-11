import {useCounter} from '../State'

const Viewer = () => {
    const count = useCounter

    return (
        <>{count}</>
    )
}

export default Viewer