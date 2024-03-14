"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatNumber, formatWithCommas, updowncheck } from "@/lib/format"
import Image from "next/image"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

interface TokenDayDataItem {
  priceUSD: string,
  high: string,
}
interface Item {
  id: string;
  symbol: string;
  tokenDayData: Array<TokenDayDataItem>;
  volumeUSD: string;
  totalSupply: string;
}

export default function Tokens() {
  const [ tokenDatas, setTokenDatas ] = useState<Item[]>([]);
  const tableEl = useRef<HTMLDivElement>(null);
  const [distanceBottom, setDistanceBottom] = useState(0);
  const [hasMore] = useState(true);
  const [filterName, setFilterName] = useState<string>("");
  const [isLoadings, setIsLoadings] = useState<Boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadings(true);
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 50, name: filterName })
      };
      const response = await fetch('/api/tokens', requestOptions);
      const data = await response.json();
      
      setTokenDatas(data.data)
      setIsLoadings(false);
    }
    fetchData()
  },[])

  const loadMore = useCallback(() => {
    const loadItems = async () => {
      await new Promise<void>((resolve) =>
        setTimeout(async () => {
          setIsLoadings(true);
          const amount = tokenDatas.length + 30;
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amount, name: filterName })
          };
          const response = await fetch('/api/tokens', requestOptions);
          const data = await response.json();
      
          setTokenDatas(data.data)
          setIsLoadings(false);
          resolve();
        }, 1000)
      );
    };
    setIsLoadings(true);
    loadItems();
  }, [tokenDatas]);

  const scrollListener = useCallback(() => {
    if (tableEl.current) {
      let bottom = tableEl.current.scrollHeight - tableEl.current.clientHeight;

      if (!distanceBottom) {
        setDistanceBottom(Math.round(bottom * 0.2));
      }

      if (tableEl.current.scrollTop > bottom - distanceBottom && hasMore && !isLoadings) {
        loadMore();
      }
    }
  }, [hasMore, loadMore, isLoadings, distanceBottom]);

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

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFilterName(e.target.value);
    filterToken()
  }
  const filterToken = async () => {
    if(filterName == ""){
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 50, name: filterName })
      };
      const res = await fetch('/api/tokens', options);
      const dataa = await res.json();
      
      setTokenDatas(dataa.data)
      return;
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: filterName })
    };
    const response = await fetch('/api/tokens-filter', requestOptions);
    const data = await response.json();
    setTokenDatas(data.data);
  }

  return (
    <>
      {isLoadings && (
        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      )}
      <div className="px-5 ">
        <div className="w-full flex justify-end mt-3" style={{ maxWidth: '80%'}}>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="email" placeholder="keyword..." onChange={onChange}/>
            <Button type="submit" onClick={() => filterToken()}>Search</Button>
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
                  <TableHead>1 day</TableHead>
                  <TableHead>1 hour</TableHead>
                  <TableHead>FDV</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokenDatas.length > 0 && tokenDatas.map((item, id) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{id + 1}</TableCell>
                    <TableCell>{item.symbol}</TableCell>
                    <TableCell>${formatWithCommas(Number(item.tokenDayData[0].priceUSD), 2)}</TableCell>
                    <TableCell className={`${updowncheck(item.tokenDayData[0].high, item.tokenDayData[1].high)[0] ? 'text-teal-400' : 'text-rose-600'}`}>
                      <div className="flex gap-2">
                      {
                        updowncheck(item.tokenDayData[0].high, item.tokenDayData[1].high)[0] ? (
                          <Image src={"/up.svg"} width={16} height={16} alt="up" />
                        ) : (
                          <Image src={"/down.svg"} width={16} height={16} alt="down" />
                        )
                      }
                      {updowncheck(item.tokenDayData[0].high, item.tokenDayData[1].high)[1]}%
                      </div>
                    </TableCell>
                    <TableCell className={`${updowncheck(item.tokenDayData[0].high, item.tokenDayData[1].high)[0] ? 'text-teal-400' : 'text-rose-600'}`}>
                      <div className="flex gap-2">
                      {
                        updowncheck(item.tokenDayData[0].high, item.tokenDayData[1].high)[0] ? (
                          <Image src={"/up.svg"} width={16} height={16} alt="up" />
                        ) : (
                          <Image src={"/down.svg"} width={16} height={16} alt="down" />
                        )
                      }
                      {updowncheck(item.tokenDayData[0].high, item.tokenDayData[1].high)[1]}%
                      </div>
                    </TableCell>
                    <TableCell>{formatNumber(Number(item.totalSupply) * Number(item.tokenDayData[0].priceUSD), 0)}</TableCell>
                    <TableCell className="text-right">{formatNumber(Number(item.volumeUSD), 0)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  )
}