import React, { useState } from "react";
import { ExternalLink, CheckCircle2, Circle, Code2, Search } from "lucide-react";

/* ── 75 most-asked LeetCode problems ── */
const PROBLEMS = [
    // Arrays & Hashing
    { id: 1, title: "Two Sum", slug: "two-sum", difficulty: "Easy", topic: "Arrays & Hashing" },
    { id: 2, title: "Best Time to Buy and Sell Stock", slug: "best-time-to-buy-and-sell-stock", difficulty: "Easy", topic: "Arrays & Hashing" },
    { id: 3, title: "Contains Duplicate", slug: "contains-duplicate", difficulty: "Easy", topic: "Arrays & Hashing" },
    { id: 4, title: "Product of Array Except Self", slug: "product-of-array-except-self", difficulty: "Medium", topic: "Arrays & Hashing" },
    { id: 5, title: "Maximum Subarray", slug: "maximum-subarray", difficulty: "Medium", topic: "Arrays & Hashing" },
    { id: 6, title: "Maximum Product Subarray", slug: "maximum-product-subarray", difficulty: "Medium", topic: "Arrays & Hashing" },
    { id: 7, title: "Find Minimum in Rotated Sorted Array", slug: "find-minimum-in-rotated-sorted-array", difficulty: "Medium", topic: "Arrays & Hashing" },
    { id: 8, title: "Search in Rotated Sorted Array", slug: "search-in-rotated-sorted-array", difficulty: "Medium", topic: "Arrays & Hashing" },
    { id: 9, title: "3Sum", slug: "3sum", difficulty: "Medium", topic: "Arrays & Hashing" },
    { id: 10, title: "Container With Most Water", slug: "container-with-most-water", difficulty: "Medium", topic: "Arrays & Hashing" },

    // Sliding Window
    { id: 11, title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", difficulty: "Medium", topic: "Sliding Window" },
    { id: 12, title: "Longest Repeating Character Replacement", slug: "longest-repeating-character-replacement", difficulty: "Medium", topic: "Sliding Window" },
    { id: 13, title: "Minimum Window Substring", slug: "minimum-window-substring", difficulty: "Hard", topic: "Sliding Window" },
    { id: 14, title: "Sliding Window Maximum", slug: "sliding-window-maximum", difficulty: "Hard", topic: "Sliding Window" },

    // Stack
    { id: 15, title: "Valid Parentheses", slug: "valid-parentheses", difficulty: "Easy", topic: "Stack" },
    { id: 16, title: "Min Stack", slug: "min-stack", difficulty: "Medium", topic: "Stack" },
    { id: 17, title: "Daily Temperatures", slug: "daily-temperatures", difficulty: "Medium", topic: "Stack" },
    { id: 18, title: "Car Fleet", slug: "car-fleet", difficulty: "Medium", topic: "Stack" },
    { id: 19, title: "Largest Rectangle in Histogram", slug: "largest-rectangle-in-histogram", difficulty: "Hard", topic: "Stack" },

    // Binary Search
    { id: 20, title: "Binary Search", slug: "binary-search", difficulty: "Easy", topic: "Binary Search" },
    { id: 21, title: "Koko Eating Bananas", slug: "koko-eating-bananas", difficulty: "Medium", topic: "Binary Search" },
    { id: 22, title: "Search a 2D Matrix", slug: "search-a-2d-matrix", difficulty: "Medium", topic: "Binary Search" },
    { id: 23, title: "Time Based Key-Value Store", slug: "time-based-key-value-store", difficulty: "Medium", topic: "Binary Search" },
    { id: 24, title: "Median of Two Sorted Arrays", slug: "median-of-two-sorted-arrays", difficulty: "Hard", topic: "Binary Search" },

    // Linked List
    { id: 25, title: "Reverse Linked List", slug: "reverse-linked-list", difficulty: "Easy", topic: "Linked List" },
    { id: 26, title: "Merge Two Sorted Lists", slug: "merge-two-sorted-lists", difficulty: "Easy", topic: "Linked List" },
    { id: 27, title: "Reorder List", slug: "reorder-list", difficulty: "Medium", topic: "Linked List" },
    { id: 28, title: "Remove Nth Node From End of List", slug: "remove-nth-node-from-end-of-list", difficulty: "Medium", topic: "Linked List" },
    { id: 29, title: "Linked List Cycle", slug: "linked-list-cycle", difficulty: "Easy", topic: "Linked List" },
    { id: 30, title: "Merge K Sorted Lists", slug: "merge-k-sorted-lists", difficulty: "Hard", topic: "Linked List" },

    // Trees
    { id: 31, title: "Invert Binary Tree", slug: "invert-binary-tree", difficulty: "Easy", topic: "Trees" },
    { id: 32, title: "Maximum Depth of Binary Tree", slug: "maximum-depth-of-binary-tree", difficulty: "Easy", topic: "Trees" },
    { id: 33, title: "Same Tree", slug: "same-tree", difficulty: "Easy", topic: "Trees" },
    { id: 34, title: "Subtree of Another Tree", slug: "subtree-of-another-tree", difficulty: "Easy", topic: "Trees" },
    { id: 35, title: "Lowest Common Ancestor of a BST", slug: "lowest-common-ancestor-of-a-binary-search-tree", difficulty: "Medium", topic: "Trees" },
    { id: 36, title: "Binary Tree Level Order Traversal", slug: "binary-tree-level-order-traversal", difficulty: "Medium", topic: "Trees" },
    { id: 37, title: "Validate Binary Search Tree", slug: "validate-binary-search-tree", difficulty: "Medium", topic: "Trees" },
    { id: 38, title: "Kth Smallest Element in a BST", slug: "kth-smallest-element-in-a-bst", difficulty: "Medium", topic: "Trees" },
    { id: 39, title: "Construct Binary Tree from Preorder and Inorder", slug: "construct-binary-tree-from-preorder-and-inorder-traversal", difficulty: "Medium", topic: "Trees" },
    { id: 40, title: "Binary Tree Maximum Path Sum", slug: "binary-tree-maximum-path-sum", difficulty: "Hard", topic: "Trees" },
    { id: 41, title: "Serialize and Deserialize Binary Tree", slug: "serialize-and-deserialize-binary-tree", difficulty: "Hard", topic: "Trees" },

    // Graphs
    { id: 42, title: "Number of Islands", slug: "number-of-islands", difficulty: "Medium", topic: "Graphs" },
    { id: 43, title: "Clone Graph", slug: "clone-graph", difficulty: "Medium", topic: "Graphs" },
    { id: 44, title: "Max Area of Island", slug: "max-area-of-island", difficulty: "Medium", topic: "Graphs" },
    { id: 45, title: "Pacific Atlantic Water Flow", slug: "pacific-atlantic-water-flow", difficulty: "Medium", topic: "Graphs" },
    { id: 46, title: "Course Schedule", slug: "course-schedule", difficulty: "Medium", topic: "Graphs" },
    { id: 47, title: "Graph Valid Tree", slug: "graph-valid-tree", difficulty: "Medium", topic: "Graphs" },
    { id: 48, title: "Word Ladder", slug: "word-ladder", difficulty: "Hard", topic: "Graphs" },

    // Dynamic Programming
    { id: 49, title: "Climbing Stairs", slug: "climbing-stairs", difficulty: "Easy", topic: "Dynamic Programming" },
    { id: 50, title: "House Robber", slug: "house-robber", difficulty: "Medium", topic: "Dynamic Programming" },
    { id: 51, title: "House Robber II", slug: "house-robber-ii", difficulty: "Medium", topic: "Dynamic Programming" },
    { id: 52, title: "Longest Palindromic Substring", slug: "longest-palindromic-substring", difficulty: "Medium", topic: "Dynamic Programming" },
    { id: 53, title: "Palindromic Substrings", slug: "palindromic-substrings", difficulty: "Medium", topic: "Dynamic Programming" },
    { id: 54, title: "Decode Ways", slug: "decode-ways", difficulty: "Medium", topic: "Dynamic Programming" },
    { id: 55, title: "Coin Change", slug: "coin-change", difficulty: "Medium", topic: "Dynamic Programming" },
    { id: 56, title: "Maximum Product Subarray", slug: "maximum-product-subarray", difficulty: "Medium", topic: "Dynamic Programming" },
    { id: 57, title: "Word Break", slug: "word-break", difficulty: "Medium", topic: "Dynamic Programming" },
    { id: 58, title: "Longest Increasing Subsequence", slug: "longest-increasing-subsequence", difficulty: "Medium", topic: "Dynamic Programming" },
    { id: 59, title: "Unique Paths", slug: "unique-paths", difficulty: "Medium", topic: "Dynamic Programming" },
    { id: 60, title: "Jump Game", slug: "jump-game", difficulty: "Medium", topic: "Dynamic Programming" },

    // Heap / Priority Queue
    { id: 61, title: "Kth Largest Element in an Array", slug: "kth-largest-element-in-an-array", difficulty: "Medium", topic: "Heap / Priority Queue" },
    { id: 62, title: "K Closest Points to Origin", slug: "k-closest-points-to-origin", difficulty: "Medium", topic: "Heap / Priority Queue" },
    { id: 63, title: "Task Scheduler", slug: "task-scheduler", difficulty: "Medium", topic: "Heap / Priority Queue" },
    { id: 64, title: "Find Median from Data Stream", slug: "find-median-from-data-stream", difficulty: "Hard", topic: "Heap / Priority Queue" },

    // Two Pointers
    { id: 65, title: "Valid Palindrome", slug: "valid-palindrome", difficulty: "Easy", topic: "Two Pointers" },
    { id: 66, title: "Two Sum II", slug: "two-sum-ii-input-array-is-sorted", difficulty: "Medium", topic: "Two Pointers" },
    { id: 67, title: "Trapping Rain Water", slug: "trapping-rain-water", difficulty: "Hard", topic: "Two Pointers" },

    // Bit Manipulation
    { id: 68, title: "Number of 1 Bits", slug: "number-of-1-bits", difficulty: "Easy", topic: "Bit Manipulation" },
    { id: 69, title: "Counting Bits", slug: "counting-bits", difficulty: "Easy", topic: "Bit Manipulation" },
    { id: 70, title: "Reverse Bits", slug: "reverse-bits", difficulty: "Easy", topic: "Bit Manipulation" },
    { id: 71, title: "Missing Number", slug: "missing-number", difficulty: "Easy", topic: "Bit Manipulation" },
    { id: 72, title: "Sum of Two Integers", slug: "sum-of-two-integers", difficulty: "Medium", topic: "Bit Manipulation" },

    // Intervals
    { id: 73, title: "Merge Intervals", slug: "merge-intervals", difficulty: "Medium", topic: "Intervals" },
    { id: 74, title: "Non-overlapping Intervals", slug: "non-overlapping-intervals", difficulty: "Medium", topic: "Intervals" },
    { id: 75, title: "Meeting Rooms II", slug: "meeting-rooms-ii", difficulty: "Medium", topic: "Intervals" },
];

const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];
const TOPICS = ["All", ...Array.from(new Set(PROBLEMS.map((p) => p.topic)))];

const DIFF_STYLE = {
    Easy: "bg-green-100 text-green-700 border border-green-300",
    Medium: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    Hard: "bg-red-100 text-red-700 border border-red-300",
};

export default function Top75() {
    const [done, setDone] = useState(new Set());
    const [diffFilter, setDiffFilter] = useState("All");
    const [topicFilter, setTopicFilter] = useState("All");
    const [search, setSearch] = useState("");

    const toggleDone = (id) =>
        setDone((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const filtered = PROBLEMS.filter((p) => {
        if (diffFilter !== "All" && p.difficulty !== diffFilter) return false;
        if (topicFilter !== "All" && p.topic !== topicFilter) return false;
        if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const completedCount = done.size;
    const progress = Math.round((completedCount / PROBLEMS.length) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FAF5E9] via-[#FFF8E7] to-[#FAF5E9] p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#009B4D] to-[#00C962] bg-clip-text text-transparent flex items-center gap-2">
                        <Code2 className="w-8 h-8 text-[#009B4D]" />
                        Top 75 LeetCode Problems
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Most-asked coding questions in product & service company interviews</p>
                </div>
                {/* Progress badge */}
                <div className="flex items-center gap-3 bg-white/80 border-2 border-[#009B4D]/20 rounded-2xl px-5 py-3 shadow">
                    <div className="text-right">
                        <p className="text-2xl font-bold text-[#009B4D]">{completedCount}<span className="text-gray-400 text-base font-normal">/{PROBLEMS.length}</span></p>
                        <p className="text-xs text-gray-400">Completed</p>
                    </div>
                    <div className="w-14 h-14 relative flex-shrink-0">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                            <circle cx="28" cy="28" r="22" fill="none" stroke="#e5e7eb" strokeWidth="5" />
                            <circle cx="28" cy="28" r="22" fill="none" stroke="#009B4D" strokeWidth="5"
                                strokeDasharray={`${2 * Math.PI * 22}`}
                                strokeDashoffset={`${2 * Math.PI * 22 * (1 - progress / 100)}`}
                                strokeLinecap="round" className="transition-all duration-500" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#009B4D]">{progress}%</span>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white/80 border-2 border-[#009B4D]/20 rounded-2xl p-4 shadow flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search problems..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#009B4D] transition-all"
                    />
                </div>

                {/* Difficulty filter */}
                <div className="flex gap-1.5 flex-wrap">
                    {DIFFICULTIES.map((d) => (
                        <button key={d} onClick={() => setDiffFilter(d)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${diffFilter === d
                                    ? "bg-[#009B4D] text-white border-[#009B4D]"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-[#009B4D]"
                                }`}>
                            {d}
                        </button>
                    ))}
                </div>

                {/* Topic filter */}
                <select
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs text-gray-600 focus:outline-none focus:border-[#009B4D] transition-all"
                >
                    {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {/* Problems list */}
            <div className="bg-white/80 border-2 border-[#009B4D]/20 rounded-2xl shadow overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[2rem_2.5rem_1fr_6rem_9rem_2.5rem] gap-2 px-5 py-3 border-b border-gray-100 bg-[#f9fdf6] text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <span>#</span>
                    <span>✓</span>
                    <span>Title</span>
                    <span>Difficulty</span>
                    <span>Topic</span>
                    <span className="text-center">Link</span>
                </div>

                <div className="divide-y divide-gray-50">
                    {filtered.length === 0 && (
                        <div className="py-12 text-center text-gray-400 text-sm">No problems match your filters.</div>
                    )}
                    {filtered.map((p) => {
                        const solved = done.has(p.id);
                        return (
                            <div
                                key={p.id}
                                className={`grid grid-cols-[2rem_2.5rem_1fr_6rem_9rem_2.5rem] gap-2 px-5 py-3.5 items-center transition-colors hover:bg-[#f0faf5] ${solved ? "bg-green-50/60" : ""}`}
                            >
                                {/* Number */}
                                <span className="text-xs text-gray-400 font-mono">{p.id}</span>

                                {/* Checkbox */}
                                <button onClick={() => toggleDone(p.id)} className="flex items-center justify-center">
                                    {solved
                                        ? <CheckCircle2 className="w-5 h-5 text-[#009B4D]" />
                                        : <Circle className="w-5 h-5 text-gray-300 hover:text-[#009B4D] transition-colors" />
                                    }
                                </button>

                                {/* Title */}
                                <span className={`text-sm font-medium ${solved ? "line-through text-gray-400" : "text-gray-800"}`}>
                                    {p.title}
                                </span>

                                {/* Difficulty */}
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit ${DIFF_STYLE[p.difficulty]}`}>
                                    {p.difficulty}
                                </span>

                                {/* Topic */}
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full truncate">{p.topic}</span>

                                {/* Link */}
                                <a
                                    href={`https://leetcode.com/problems/${p.slug}/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center text-[#009B4D] hover:text-[#00C962] transition-colors"
                                    title="Open in LeetCode"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        );
                    })}
                </div>

                {/* Footer count */}
                <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
                    <span>Showing {filtered.length} of {PROBLEMS.length} problems</span>
                    <span>{completedCount} solved · {PROBLEMS.length - completedCount} remaining</span>
                </div>
            </div>
        </div>
    );
}
