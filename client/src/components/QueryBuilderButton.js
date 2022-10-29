
import ConstructionSharpIcon from '@mui/icons-material/ConstructionSharp';

export default function QueryBuilderButton ( props ) {

    const handleClick = () =>{
        props.handleQueryBuilderButton();
    }

    return (
        <button onClick={handleClick} className="bg-yellow-300 p-2 rounded-lg shadow-lg font-bold font-mono hover:bg-yellow-200">
            <ConstructionSharpIcon /> Query Builder
        </button>
    );
}
