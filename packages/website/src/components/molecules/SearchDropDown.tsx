import { Search } from "lucide-react";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "@/components/atoms/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/atoms/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/atoms/command";
import InfiniteScroll from 'react-infinite-scroll-component';

interface Item {
    id: string;
    label: string;
    sublabel?: string;
    value: string;
}

type FetchItemsResponse = {
    items: Item[];
    hasMore: boolean;
};

interface SearchDropdownProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    items?: Item[];
    fetchItems?: (params: { pageParam: number; search: string }) => Promise<FetchItemsResponse>;
    placeholder: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    icon?: React.ReactNode;
    renderItem?: (item: Item) => React.ReactNode;
}

export default function SearchDropdown({
    id,
    value,
    onChange,
    items,
    fetchItems,
    placeholder,
    searchPlaceholder = "Search...",
    emptyMessage = "No items found.",
    open,
    onOpenChange,
    icon = <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />,
    renderItem,
}: SearchDropdownProps) {
    const [search, setSearch] = useState("");

    const {
        data,
        fetchNextPage,
        hasNextPage,
        refetch
    } = useInfiniteQuery({
        queryKey: [`search-dropdown-${id}`, search],
        queryFn: ({ pageParam = 1 }) =>
            fetchItems?.({ pageParam, search }) ?? Promise.resolve({ items: [], hasMore: false }),
        enabled: !!fetchItems && open,
        getNextPageParam: (lastPage, pages) =>
            lastPage.hasMore ? pages.length + 1 : undefined,
        initialPageParam: 1,
    });
    // Handle search input changes
    const handleSearch = (value: string) => {
        setSearch(value);
        refetch();
    };

    const displayItems = items || data?.pages.flatMap(page => page.items) || [];

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between bg-white/50"
                >
                    {value
                        ? displayItems.find((item) => item.value === value)?.label || placeholder
                        : placeholder}
                    {icon}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command className="pointer-events-auto">
                    <CommandInput
                        placeholder={searchPlaceholder}
                        value={search}
                        onValueChange={handleSearch}
                    />
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandList id="infinite-scroll-container">
                        <CommandGroup>
                            <InfiniteScroll
                                dataLength={displayItems.length}
                                next={fetchNextPage}
                                hasMore={!!hasNextPage}
                                loader={<div className="text-center py-2">Loading more...</div>}
                                scrollableTarget="infinite-scroll-container"
                                scrollThreshold="90%"
                                height={300}
                                endMessage={
                                    <div className="text-center py-2 text-sm text-gray-500">
                                        No more results
                                    </div>
                                }
                            >
                                {displayItems.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.value}
                                        onSelect={(value) => {
                                            onChange(value);
                                            onOpenChange(false);
                                        }}
                                    >
                                        {renderItem ? (
                                            renderItem(item)
                                        ) : (
                                            <div className="flex flex-col">
                                                <span>{item.label}</span>
                                                {item.sublabel && (
                                                    <span className="text-xs text-muted-foreground">{item.sublabel}</span>
                                                )}
                                            </div>
                                        )}
                                    </CommandItem>
                                ))}
                            </InfiniteScroll>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
