import { useState, useEffect } from 'react';

export default function useGetTableRows( tableName: string ): { rows: Array< Record< string, string | number > > } {
    const [ rows, setRows ] = useState< Array< Record< string, string | number > > >( [] );

    useEffect( () => {
        if ( ! tableName ) {
            return;
        }
        const fetchOption = async () => {
            const res = await fetch( `${import.meta.env.VITE_API_URL}/tables/${ tableName }/rows` );
            const data = await res.json();
            setRows( data );
        };
        fetchOption();
    }, [ tableName ] );

    return { rows };
}