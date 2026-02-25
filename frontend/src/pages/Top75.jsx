import React, { useState } from "react";
import { ExternalLink, CheckCircle2, Circle, Code2, Search } from "lucide-react";

const PROBLEMS = [
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
    { id: 11, title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", difficulty: "Medium", topic: "Sliding Window" },
    { id: 12, title: "Longest Repeating Character Replacement", slug: "longest-repeating-character-replacement", difficulty: "Medium", topic: "Sliding Window" },
    { id: 13, title: "Minimum Window Substring", slug: "minimum-window-substring", difficulty: "Hard", topic: "Sliding Window" },
    { id: 14, title: "Sliding Window Maximum", slug: "sliding-window-maximum", difficulty: "Hard", topic: "Sliding Window" },
    { id: 15, title: "Valid Parentheses", slug: "valid-parentheses", difficulty: "Easy", topic: "Stack" },
    { id: 16, title: "Min Stack", slug: "min-stack", difficulty: "Medium", topic: "Stack" },
    { id: 17, title: "Daily Temperatures", slug: "daily-temperatures", difficulty: "Medium", topic: "Stack" },
    { id: 18, title: "Car Fleet", slug: "car-fleet", difficulty: "Medium", topic: "Stack" },
    { id: 19, title: "Largest Rectangle in Histogram", slug: "largest-rectangle-in-histogram", difficulty: "Hard", topic: "Stack" },
    { id: 20, title: "Binary Search", slug: "binary-search", difficulty: "Easy", topic: "Binary Search" },
    { id: 21, title: "Koko Eating Bananas", slug: "koko-eating-bananas", difficulty: "Medium", topic: "Binary Search" },
    { id: 22, title: "Search a 2D Matrix", slug: "search-a-2d-matrix", difficulty: "Medium", topic: "Binary Search" },
    { id: 23, title: "Time Based Key-Value Store", slug: "time-based-key-value-store", difficulty: "Medium", topic: "Binary Search" },
    { id: 24, title: "Median of Two Sorted Arrays", slug: "median-of-two-sorted-arrays", difficulty: "Hard", topic: "Binary Search" },
    { id: 25, title: "Reverse Linked List", slug: "reverse-linked-list", difficulty: "Easy", topic: "Linked List" },
    { id: 26, title: "Merge Two Sorted Lists", slug: "merge-two-sorted-lists", difficulty: "Easy", topic: "Linked List" },
    { id: 27, title: "Reorder List", slug: "reorder-list", difficulty: "Medium", topic: "Linked List" },
    { id: 28, title: "Remove Nth Node From End of List", slug: "remove-nth-node-from-end-of-list", difficulty: "Medium", topic: "Linked List" },
    { id: 29, title: "Linked List Cycle", slug: "linked-list-cycle", difficulty: "Easy", topic: "Linked List" },
    { id: 30, title: "Merge K Sorted Lists", slug: "merge-k-sorted-lists", difficulty: "Hard", topic: "Linked List" },
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
    { id: 42, title: "Number of Islands", slug: "number-of-islands", difficulty: "Medium", topic: "Graphs" },
    { id: 43, title: "Clone Graph", slug: "clone-graph", difficulty: "Medium", topic: "Graphs" },
    { id: 44, title: "Max Area of Island", slug: "max-area-of-island", difficulty: "Medium", topic: "Graphs" },
    { id: 45, title: "Pacific Atlantic Water Flow", slug: "pacific-atlantic-water-flow", difficulty: "Medium", topic: "Graphs" },
    { id: 46, title: "Course Schedule", slug: "course-schedule", difficulty: "Medium", topic: "Graphs" },
    { id: 47, title: "Graph Valid Tree", slug: "graph-valid-tree", difficulty: "Medium", topic: "Graphs" },
    { id: 48, title: "Word Ladder", slug: "word-ladder", difficulty: "Hard", topic: "Graphs" },
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
    { id: 61, title: "Kth Largest Element in an Array", slug: "kth-largest-element-in-an-array", difficulty: "Medium", topic: "Heap / Priority Queue" },
    { id: 62, title: "K Closest Points to Origin", slug: "k-closest-points-to-origin", difficulty: "Medium", topic: "Heap / Priority Queue" },
    { id: 63, title: "Task Scheduler", slug: "task-scheduler", difficulty: "Medium", topic: "Heap / Priority Queue" },
    { id: 64, title: "Find Median from Data Stream", slug: "find-median-from-data-stream", difficulty: "Hard", topic: "Heap / Priority Queue" },
    { id: 65, title: "Valid Palindrome", slug: "valid-palindrome", difficulty: "Easy", topic: "Two Pointers" },
    { id: 66, title: "Two Sum II", slug: "two-sum-ii-input-array-is-sorted", difficulty: "Medium", topic: "Two Pointers" },
    { id: 67, title: "Trapping Rain Water", slug: "trapping-rain-water", difficulty: "Hard", topic: "Two Pointers" },
    { id: 68, title: "Number of 1 Bits", slug: "number-of-1-bits", difficulty: "Easy", topic: "Bit Manipulation" },
    { id: 69, title: "Counting Bits", slug: "counting-bits", difficulty: "Easy", topic: "Bit Manipulation" },
    { id: 70, title: "Reverse Bits", slug: "reverse-bits", difficulty: "Easy", topic: "Bit Manipulation" },
    { id: 71, title: "Missing Number", slug: "missing-number", difficulty: "Easy", topic: "Bit Manipulation" },
    { id: 72, title: "Sum of Two Integers", slug: "sum-of-two-integers", difficulty: "Medium", topic: "Bit Manipulation" },
    { id: 73, title: "Merge Intervals", slug: "merge-intervals", difficulty: "Medium", topic: "Intervals" },
    { id: 74, title: "Non-overlapping Intervals", slug: "non-overlapping-intervals", difficulty: "Medium", topic: "Intervals" },
    { id: 75, title: "Meeting Rooms II", slug: "meeting-rooms-ii", difficulty: "Medium", topic: "Intervals" },
];

const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];
const TOPICS = ["All", ...Array.from(new Set(PROBLEMS.map((p) => p.topic)))];

const DIFF_STYLE = {
    Easy: { background: "rgba(34,211,238,0.12)", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.3)" },
    Medium: { background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" },
    Hard: { background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.4)" },
};

export default function Top75() {
    const [done, setDone] = useState(new Set());
    const [diffFilter, setDiffFilter] = useState("All");
    const [topicFilter, setTopicFilter] = useState("All");
    const [search, setSearch] = useState("");

    const toggleDone = (id) => setDone((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });

    const filtered = PROBLEMS.filter((p) => {
        if (diffFilter !== "All" && p.difficulty !== diffFilter) return false;
        if (topicFilter !== "All" && p.topic !== topicFilter) return false;
        if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const completedCount = done.size;
    const progress = Math.round((completedCount / PROBLEMS.length) * 100);
    const circumference = 2 * Math.PI * 22;

    return (
        <div className="min-h-screen p-6 space-y-6 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #050818 0%, #0a0f2e 50%, #06081a 100%)" }}>

            {/* Ambient blobs */}
            <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)" }} />
            <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)" }} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", boxShadow: "0 0 20px rgba(139,92,246,0.5)" }}>
                            <Code2 className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-3xl font-extrabold"
                            style={{ background: "linear-gradient(90deg,#a78bfa,#06b6d4)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Top 75 LeetCode
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm mt-1 ml-0">Most-asked questions in product & service interviews</p>
                </div>

                {/* Progress badge */}
                <div className="flex items-center gap-4 px-5 py-3 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.25)", backdropFilter: "blur(12px)" }}>
                    <div className="text-right">
                        <p className="text-2xl font-extrabold text-white">{completedCount}
                            <span className="text-slate-500 text-base font-normal">/{PROBLEMS.length}</span>
                        </p>
                        <p className="text-xs text-slate-500">Completed</p>
                    </div>
                    <div className="w-14 h-14 relative flex-shrink-0">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                            <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                            <circle cx="28" cy="28" r="22" fill="none" strokeWidth="5"
                                stroke="url(#progressGrad)"
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference * (1 - progress / 100)}
                                strokeLinecap="round"
                                style={{ transition: "stroke-dashoffset 0.5s ease" }} />
                            <defs>
                                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                            style={{ background: "linear-gradient(135deg,#a78bfa,#22d3ee)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            {progress}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(139,92,246,0.2)", backdropFilter: "blur(12px)" }}>
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search problems..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)" }} />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {DIFFICULTIES.map((d) => (
                        <button key={d} onClick={() => setDiffFilter(d)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                            style={diffFilter === d
                                ? { background: "linear-gradient(135deg,#8b5cf6,#06b6d4)", color: "white", boxShadow: "0 2px 12px rgba(139,92,246,0.45)" }
                                : { background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)" }}>
                            {d}
                        </button>
                    ))}
                </div>
                <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg text-xs text-slate-400 focus:outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)" }}>
                    {TOPICS.map((t) => <option key={t} value={t} style={{ background: "#0a0f2e" }}>{t}</option>)}
                </select>
            </div>

            {/* Problems List */}
            <div className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(139,92,246,0.2)", backdropFilter: "blur(12px)" }}>
                <div className="grid grid-cols-[2rem_2.5rem_1fr_6rem_9rem_2.5rem] gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ borderBottom: "1px solid rgba(139,92,246,0.15)", background: "rgba(139,92,246,0.06)", color: "#64748b" }}>
                    <span>#</span><span>✓</span><span>Title</span><span>Difficulty</span><span>Topic</span><span className="text-center">Link</span>
                </div>
                <div>
                    {filtered.length === 0 && <div className="py-12 text-center text-slate-600 text-sm">No problems match your filters.</div>}
                    {filtered.map((p) => {
                        const solved = done.has(p.id);
                        return (
                            <div key={p.id}
                                className="grid grid-cols-[2rem_2.5rem_1fr_6rem_9rem_2.5rem] gap-2 px-5 py-3.5 items-center transition-all duration-200"
                                style={{
                                    borderBottom: "1px solid rgba(255,255,255,0.03)",
                                    background: solved ? "rgba(139,92,246,0.07)" : "transparent",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = solved ? "rgba(139,92,246,0.12)" : "rgba(255,255,255,0.025)"}
                                onMouseLeave={e => e.currentTarget.style.background = solved ? "rgba(139,92,246,0.07)" : "transparent"}>

                                <span className="text-xs text-slate-600 font-mono">{p.id}</span>
                                <button onClick={() => toggleDone(p.id)} className="flex items-center justify-center">
                                    {solved
                                        ? <CheckCircle2 className="w-5 h-5" style={{ color: "#8b5cf6", filter: "drop-shadow(0 0 6px #8b5cf688)" }} />
                                        : <Circle className="w-5 h-5 text-slate-700 hover:text-violet-400 transition-colors" />}
                                </button>
                                <span className={`text-sm font-medium transition-colors ${solved ? "line-through text-slate-600" : "text-slate-200"}`}>{p.title}</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit" style={DIFF_STYLE[p.difficulty]}>{p.difficulty}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full truncate" style={{ background: "rgba(255,255,255,0.04)", color: "#64748b" }}>{p.topic}</span>
                                <a href={`https://leetcode.com/problems/${p.slug}/`} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-center transition-all duration-200"
                                    style={{ color: "#4f46e5" }}
                                    onMouseEnter={e => { e.currentTarget.style.color = "#8b5cf6"; e.currentTarget.style.transform = "scale(1.2)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = "#4f46e5"; e.currentTarget.style.transform = "scale(1)"; }}>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        );
                    })}
                </div>
                <div className="px-5 py-3 text-xs flex justify-between" style={{ borderTop: "1px solid rgba(139,92,246,0.12)", color: "#475569" }}>
                    <span>Showing {filtered.length} of {PROBLEMS.length}</span>
                    <span style={{ background: "linear-gradient(90deg,#a78bfa,#22d3ee)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "bold" }}>
                        {completedCount} solved
                    </span>
                </div>
            </div>
        </div>
    );
}
