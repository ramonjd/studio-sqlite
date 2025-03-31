import { useTables, useGetOption, useTableColumns, useGetTableRows } from './hooks';
import { useState } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function App() {
  const [ selectedTable, setSelectedTable ] = useState< string >( '' );
  const { tables } = useTables();
  const { value: blognameValue } = useGetOption( 'blogname' );
  const { columns } = useTableColumns( selectedTable );
  const { rows } = useGetTableRows( selectedTable );

  return (
    <main>
      <h1 className="text-2xl font-bold a8c-blueberry-5">Studio SQLite - { blognameValue }</h1>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <ul>  
            { tables.map( ( table: string ) => (
              <li key={ table } onClick={ () => setSelectedTable( table ) }>{ table }</li>
            ) )}
          </ul>
        </ResizablePanel>
        <ResizableHandle className="w-1 bg-gray-200" />
        <ResizablePanel>
            { columns && rows && (
                       <Table>
                        <TableCaption>{ selectedTable }</TableCaption>
                       <TableHeader>
                         <TableRow>
                           { columns.map( ( column: Record<string, string | number> ) => (
                             <TableHead key={ column.name }>{ column.name }</TableHead>
                           ) )}
                         </TableRow>
                       </TableHeader>
                       <TableBody>
                           { rows.map( ( row: Record<string, string | number>, index: number ) => (
                             <TableRow key={ `row-${ index }` }>
                               { columns.map( ( column: Record<string, string | number> ) => (
                                 <TableCell key={ column.name }>{ row[ column.name ] }</TableCell>
                               ) )}
                             </TableRow>
                           ) )}
                         </TableBody>
                     </Table>
            ) }
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  )
}

export default App
