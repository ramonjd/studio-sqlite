import { useState, useEffect } from "react";

export default function useGetOption( optionName: string ): Record< string, string | number > {
    const [ option, setOption ] = useState< Record< string, string | number > >( {} );

    useEffect( () => {
        const fetchOption = async () => {
            if ( ! optionName ) {
                return;
            }
            const res = await fetch( `${import.meta.env.VITE_API_URL}/options/${ optionName }` );
            const data = await res.json();
            if ( data.length > 0 ) {
                setOption( {
                    name: data[ 0 ].option_name,
                    value: data[ 0 ].option_value,    
                } );
            }
        };
        fetchOption();
    }, [ optionName ] );

    return option;
}