import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "../css/readmore.css"

const ReadMorePage = () => {
    const { id } = useParams();
    const [movie, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); 

    /*useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await fetch(`https://api.example.com/data/${id}`);
                if (!response) {
                    throw new Error("Network was not okay!")
                }
                let result = await response.json()
                setData(result)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, [id]);

    if (loading) return (<h2>Loading</h2>);
    if (error) return (<h2>Error</h2>);*/

    return (
        <div>
            <h2>{movie.name}</h2>
        </div>

    );
} 

export default ReadMorePage