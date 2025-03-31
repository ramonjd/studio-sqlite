import { useState, useEffect } from "react";

export default function useTables(): { tables: string[] } {
    const [ tables, setTables ] = useState< string[] >( [] );

    useEffect( () => {
        const fetchTables = async () => {
            const res = await fetch( `${import.meta.env.VITE_API_URL}/tables` );
            const data = await res.json();
            const tableNames = data.map( ( table: { name: string } ) => table?.name );
            setTables( tableNames );
        };
        fetchTables();
    }, [] );

    return { tables };
}