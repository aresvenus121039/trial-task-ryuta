"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

interface Item {
  id: string;
  symbol: string;
  decimals: string;
  volume: string;
}

const generateDatas = (num: number) => 
  Array(num).fill(0).map((item, id) => ({
    id: `id -> ${id}`,
    symbol: `symbol -> ${id}`,
    decimals: `decimals -> ${id}`,
    volume: `volume -> ${id}`
  }))

export default function Tokens() {
  const [ tokenDatas, setTokenDatas ] = useState<Item[]>([]);
  const tableEl = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [distanceBottom, setDistanceBottom] = useState(0);
  const [hasMore] = useState(true);

  useEffect(() => {
    setTokenDatas(generateDatas(50));
  },[])

  const loadMore = useCallback(() => {
    const loadItems = async () => {
      await new Promise<void>((resolve) =>
        setTimeout(async () => {
          const amount = tokenDatas.length + 30;
          // const requestOptions = {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ amount: amount, name: filterName })
          // };
          // const response = await fetch('/api/get-tokens', requestOptions);
          // const data = await response.json();
      
          setTokenDatas(generateDatas(amount))
          setLoading(false);
          resolve();
        }, 1000)
      );
    };
    setLoading(true);
    loadItems();
  }, [tokenDatas]);

  const scrollListener = useCallback(() => {
    if (tableEl.current) {
      let bottom = tableEl.current.scrollHeight - tableEl.current.clientHeight;

      if (!distanceBottom) {
        setDistanceBottom(Math.round(bottom * 0.2));
      }

      if (tableEl.current.scrollTop > bottom - distanceBottom && hasMore && !loading) {
        loadMore();
      }
    }
  }, [hasMore, loadMore, loading, distanceBottom]);

  useLayoutEffect(() => {
    const tableRef = tableEl.current;
    if (tableRef) {
      tableRef.addEventListener('scroll', scrollListener);
    }
    return () => {
      if (tableRef) {
        tableRef.removeEventListener('scroll', scrollListener);
      }
    };
  }, [scrollListener]);

  return (
    <div className="px-5 ">
      <div className="w-full flex justify-end mt-3" style={{ maxWidth: '80%'}}>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="email" placeholder="keyword..." />
          <Button type="submit">Search</Button>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-full mt-3 overflow-y-scroll border-2 border-slate-100" style={{ maxHeight: '600px', maxWidth: '80%'}} ref={tableEl}>
          <Table className="relative">
            <TableHeader className="sticky top-0">
              <TableRow>
                <TableHead className="w-[100px]">No</TableHead>
                <TableHead>Token Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokenDatas.map((item, id) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{id + 1}</TableCell>
                  <TableCell>{item.symbol}</TableCell>
                  <TableCell>{item.decimals}</TableCell>
                  <TableCell className="text-right">{item.volume}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}