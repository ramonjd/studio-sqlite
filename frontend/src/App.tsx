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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Chat } from './components/Chat';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

function App() {
  const [ selectedTable, setSelectedTable ] = useState< string >( '' );
  const { tables } = useTables();
  const { value: blognameValue } = useGetOption( 'blogname' );
  const { columns } = useTableColumns( selectedTable );
  const { rows } = useGetTableRows( selectedTable );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-2xl font-bold text-primary">Studio SQLite</h1>
          <div className="ml-4 text-muted-foreground">
            { blognameValue }
          </div>
          <div className="ml-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <MessageSquare className="h-5 w-5" />
                  <span className="sr-only">Open chat</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Get to know your database</SheetTitle>
                </SheetHeader>
                <div className="h-[calc(100vh-5rem)]">
                  <Chat />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-4rem)]">
          {/* Tables Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15}>
            <Card className="h-full rounded-none border-0">
              <CardHeader>
                <CardTitle>Tables</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  <div className="space-y-1 p-2">
                    { tables.map( ( table: string ) => (
                      <div
                        key={ table }
                        onClick={ () => setSelectedTable( table ) }
                        className={`cursor-pointer rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                          selectedTable === table ? 'bg-accent text-accent-foreground' : ''
                        }`}
                      >
                        { table }
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </ResizablePanel>

          <ResizableHandle />

          {/* Table Content */}
          <ResizablePanel defaultSize={80}>
            <Card className="h-full rounded-none border-0">
              <CardHeader>
                <CardTitle>{ selectedTable || 'Select a table' }</CardTitle>
              </CardHeader>
              <CardContent>
                { columns && rows ? (
                  <div className="h-[calc(100vh-12rem)] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          { columns.map( ( column: Record<string, string | number> ) => (
                            <TableHead key={ column.name }>{ column.name }</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        { rows.map( ( row: Record<string, string | number>, index: number ) => (
                          <TableRow key={ `row-${ index }` }>
                            { columns.map( ( column: Record<string, string | number> ) => (
                              <TableCell key={ column.name }>
                                { typeof row[ column.name ] === 'string' && row[ column.name ].toString().length > 55
                                  ? `${row[ column.name ].toString().substring(0, 55)}...`
                                  : row[ column.name ] }
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex h-[calc(100vh-12rem)] items-center justify-center text-muted-foreground">
                    Select a table to view its contents
                  </div>
                )}
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  )
}

export default App
