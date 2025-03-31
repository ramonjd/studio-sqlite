import { useState, useEffect } from 'react';

export default function useTableColumns( tableName: string ): { columns: Array< Record< string, string | number > > } {
    const [ columns, setColumns ] = useState< Array< Record< string, string | number > > >( [] );

    useEffect( () => {
        if ( ! tableName ) {
            return;
        }
        const fetchOption = async () => {
            const res = await fetch( `${import.meta.env.VITE_API_URL}/tables/${ tableName }/columns` );
            const data = await res.json();
            setColumns( data );
        };
        fetchOption();
    }, [ tableName ] );

    return { columns };
}