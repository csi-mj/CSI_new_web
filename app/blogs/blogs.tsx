
"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowRight,
  ArrowUpDown,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Search,
  UserRound,
} from "lucide-react";

// Import blog data from your data folder
import {
  blogs,
  categories,
  FEATURED_BLOG,
  MEDIUM_URL,
  POSTS_PER_PAGE,
} from "./data/blogData";

// --------------------------------------------------
// ANIMATIONS
// --------------------------------------------------

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// --------------------------------------------------
// BLOGS PAGE
// --------------------------------------------------

const BlogsPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [sortOrder, setSortOrder] = useState<
    "newest" | "oldest"
  >("newest");

  const [sortOpen, setSortOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const sortRef = useRef<HTMLDivElement>(null);

  // -----------------------------------------------
  // CLOSE DROPDOWN
  // -----------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortRef.current &&
        !sortRef.current.contains(event.target as Node)
      ) {
        setSortOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // -----------------------------------------------
  // SEARCH + CATEGORY + SORT
  // -----------------------------------------------

  const filteredBlogs = useMemo(() => {
    const filtered = blogs.filter((blog) => {
      const matchesCategory =
        category === "All" || blog.category === category;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        blog.title.toLowerCase().includes(searchText) ||
        blog.description.toLowerCase().includes(searchText) ||
        blog.author.toLowerCase().includes(searchText) ||
        blog.category.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });
  }, [search, category, sortOrder]);

  // -----------------------------------------------
  // PAGINATION
  // -----------------------------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBlogs.length / POSTS_PER_PAGE)
  );

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // -----------------------------------------------
  // HANDLERS
  // -----------------------------------------------

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSortChange = (
    value: "newest" | "oldest"
  ) => {
    setSortOrder(value);
    setCurrentPage(1);
    setSortOpen(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // -----------------------------------------------
  // UI
  // -----------------------------------------------

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">

      {/* ========================================== */}
      {/* HERO */}
      {/* ========================================== */}

      <section className="relative px-5 pb-12 pt-28 sm:px-8 sm:pt-32">

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute left-1/2 top-[-250px] h-[550px] w-[550px] -translate-x-1/2 rounded-full border border-red-500/10" />

          <div className="absolute left-1/2 top-[-180px] h-[450px] w-[450px] -translate-x-1/2 rounded-full border border-red-500/15" />

          <div className="absolute left-1/2 top-[-100px] h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[100px]" />

        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-5xl text-center"
        >

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >

            THE CSI{" "}

            <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              JOURNAL
            </span>

          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base"
          >

            Ideas, perspectives and stories from the CSI community

            <br className="hidden sm:block" />

            on technology, innovation and beyond.

          </motion.p>

        </motion.div>

      </section>

      {/* ========================================== */}
      {/* FEATURED BLOG */}
      {/* ========================================== */}

      <section className="px-5 sm:px-8">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto grid max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0d] md:grid-cols-2"
        >

          <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">

            <div>

              <span className="inline-flex rounded-md bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                Featured
              </span>

              <h2 className="mt-6 text-2xl font-semibold leading-tight sm:text-3xl">
                {FEATURED_BLOG.title}
              </h2>

              <p className="mt-5 max-w-md text-sm leading-6 text-white/55">
                {FEATURED_BLOG.description}
              </p>

            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">

                  <UserRound
                    size={17}
                    className="text-white/60"
                  />

                </div>

                <div>

                  <p className="text-xs font-medium">
                    {FEATURED_BLOG.author}
                  </p>

                  <p className="mt-1 text-[11px] text-white/40">

                    {formatDate(FEATURED_BLOG.date)}

                    {" · "}

                    {FEATURED_BLOG.readTime}

                  </p>

                </div>

              </div>

              <motion.a
                href={FEATURED_BLOG.link}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-xs font-semibold transition-colors hover:bg-red-700"
              >

                Read Article

                <ArrowRight size={14} />

              </motion.a>

            </div>

          </div>

          <div className="relative min-h-[260px] overflow-hidden sm:min-h-[350px]">

            <img
              src={FEATURED_BLOG.image}
              alt={FEATURED_BLOG.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          </div>

        </motion.div>

      </section>

      {/* ========================================== */}
      {/* MEDIUM */}
      {/* ========================================== */}

      <section className="px-5 pt-8 sm:px-8">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="group relative mx-auto flex max-w-6xl flex-col gap-6 overflow-hidden rounded-xl border border-red-500/25 bg-[#0b0b0d] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7"
        >

          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-red-900/15 to-transparent opacity-70" />

          <div className="relative flex items-center gap-4">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-black">

              <span className="font-serif text-4xl font-bold">
                M
              </span>

            </div>

            <div>

              <h2 className="text-base font-semibold sm:text-lg">
                Explore more articles on our Medium
              </h2>

              <p className="mt-2 text-xs leading-5 text-white/50 sm:text-sm">
                Read our latest blogs, technical write-ups and event recaps on CSI MJCET&apos;s Medium page.
              </p>

            </div>

          </div>

          <motion.a
            href={MEDIUM_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="relative inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-xs font-semibold transition-colors hover:bg-red-700"
          >

            Visit Our Medium

            <ExternalLink size={14} />

          </motion.a>

        </motion.div>

      </section>

      {/* ========================================== */}
      {/* SEARCH + FILTERS + SORT */}
      {/* ========================================== */}

      <section className="px-5 pb-6 pt-12 sm:px-8 sm:pt-16">

        <div className="mx-auto max-w-6xl">

          <div className="flex flex-col gap-5">

            {/* Categories */}

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">

              {categories.map((item) => (

                <motion.button
                  key={item}
                  onClick={() => handleCategoryChange(item)}
                  whileTap={{ scale: 0.95 }}
                  className={`shrink-0 rounded-lg border px-4 py-2.5 text-xs font-medium transition-all duration-300 ${
                    category === item
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-white/10 bg-[#080808] text-white/60 hover:border-white/25 hover:text-white"
                  }`}
                >

                  {item}

                </motion.button>

              ))}

            </div>

            {/* Search + Sorting */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">

              {/* Search */}

              <div className="relative">

                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    handleSearchChange(e.target.value)
                  }
                  placeholder="Search articles..."
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#080808] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-red-500/50"
                />

              </div>

              {/* CUSTOM SORT DROPDOWN */}

              <div
                ref={sortRef}
                className="relative w-full sm:w-[260px]"
              >

                {/* Trigger */}

                <motion.button
                  type="button"
                  onClick={() =>
                    setSortOpen((prev) => !prev)
                  }
                  whileTap={{ scale: 0.98 }}
                  aria-expanded={sortOpen}
                  aria-haspopup="listbox"
                  className={`flex h-12 w-full items-center justify-between rounded-full border bg-[#080808] px-5 text-sm transition-colors ${
                    sortOpen
                      ? "border-red-500/50"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >

                  <span className="flex items-center gap-3">

                    <ArrowUpDown
                      size={15}
                      className="text-white/45"
                    />

                    <span className="text-white/80">

                      {sortOrder === "newest"
                        ? "Latest to Oldest"
                        : "Oldest to Latest"}

                    </span>

                  </span>

                  <motion.span
                    animate={{
                      rotate: sortOpen ? 180 : 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >

                    <ChevronDown
                      size={16}
                      className="text-white/45"
                    />

                  </motion.span>

                </motion.button>

                {/* Dropdown */}

                <AnimatePresence>

                  {sortOpen && (

                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -8,
                        scale: 0.97,
                        filter: "blur(3px)",
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: "blur(0px)",
                      }}
                      exit={{
                        opacity: 0,
                        y: -6,
                        scale: 0.98,
                        filter: "blur(2px)",
                      }}
                      transition={{
                        duration: 0.25,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      role="listbox"
                      className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0e] p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
                    >

                      {[
                        {
                          label: "Latest to Oldest",
                          value: "newest" as const,
                        },
                        {
                          label: "Oldest to Latest",
                          value: "oldest" as const,
                        },
                      ].map((option, index) => (

                        <motion.button
                          key={option.value}
                          type="button"
                          role="option"
                          aria-selected={
                            sortOrder === option.value
                          }
                          initial={{
                            opacity: 0,
                            x: -8,
                          }}
                          animate={{
                            opacity: 1,
                            x: 0,
                          }}
                          exit={{
                            opacity: 0,
                            x: -4,
                          }}
                          transition={{
                            duration: 0.2,
                            delay: index * 0.04,
                          }}
                          onClick={() =>
                            handleSortChange(option.value)
                          }
                          className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm transition-colors ${
                            sortOrder === option.value
                              ? "bg-red-600/10 text-red-400"
                              : "text-white/65 hover:bg-white/[0.06] hover:text-white"
                          }`}
                        >

                          {option.label}

                          {sortOrder === option.value && (

                            <Check
                              size={15}
                              className="text-red-500"
                            />

                          )}

                        </motion.button>

                      ))}

                    </motion.div>

                  )}

                </AnimatePresence>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================== */}
      {/* BLOG GRID */}
      {/* ========================================== */}

      <section className="px-5 pb-8 sm:px-8">

        <div className="mx-auto max-w-6xl">

          <AnimatePresence mode="wait">

            <motion.div
              key={`${category}-${search}-${sortOrder}-${currentPage}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >

              {paginatedBlogs.map((blog) => (

                <motion.article
                  key={blog.id}
                  variants={fadeUp}
                  transition={{ duration: 0.45 }}
                  whileHover={{ y: -6 }}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0d] transition-colors duration-300 hover:border-red-500/30"
                >

                  {/* Image */}

                  <a
                    href={blog.link}
                    className="relative block aspect-[16/9] overflow-hidden"
                  >

                    <img
                      src={blog.image}
                      alt={blog.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                  </a>

                  {/* Content */}

                  <div className="flex flex-1 flex-col p-5">

                    {/* Category + Date */}

                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-white/40">

                      <span className="rounded-md bg-white/[0.07] px-2 py-1 text-white/70">
                        {blog.category}
                      </span>

                      <span className="flex items-center gap-1.5">

                        <CalendarDays size={11} />

                        {formatDate(blog.date)}

                      </span>

                    </div>

                    {/* Title */}

                    <a href={blog.link}>

                      <h3 className="mt-4 text-base font-semibold leading-6 transition-colors group-hover:text-red-400">
                        {blog.title}
                      </h3>

                    </a>

                    {/* Description */}

                    <p className="mt-3 line-clamp-3 text-xs leading-5 text-white/50">
                      {blog.description}
                    </p>

                    {/* Author + Reading time */}

                    <div className="mt-auto flex items-center justify-between gap-3 pt-6">

                      <div className="flex min-w-0 items-center gap-2">

                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">

                          <UserRound
                            size={13}
                            className="text-white/60"
                          />

                        </div>

                        <span className="truncate text-[10px] text-white/70">
                          {blog.author}
                        </span>

                      </div>

                      <span className="flex shrink-0 items-center gap-1 text-[10px] text-white/50">

                        <Clock size={11} />

                        {blog.readTime}

                      </span>

                    </div>

                    {/* Read Article */}

                    <a
                      href={blog.link}
                      className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] font-medium text-white/50 transition-colors hover:text-red-400"
                    >

                      Read Article

                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-1"
                      />

                    </a>

                  </div>

                </motion.article>

              ))}

            </motion.div>

          </AnimatePresence>

          {/* EMPTY STATE */}

          {filteredBlogs.length === 0 && (

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/10 bg-[#0b0b0d] px-5 py-20 text-center"
            >

              <Search
                className="mx-auto mb-4 text-white/30"
                size={28}
              />

              <h3 className="text-lg font-semibold">
                No articles found
              </h3>

              <p className="mt-2 text-sm text-white/40">
                Try another search or category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setCurrentPage(1);
                }}
                className="mt-5 text-xs font-medium text-red-500 hover:text-red-400"
              >

                Clear filters

              </button>

            </motion.div>

          )}

          {/* ======================================== */}
          {/* PAGINATION */}
          {/* ======================================== */}

          {filteredBlogs.length > 0 && (

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 flex flex-col items-center"
            >

              <div className="flex flex-wrap items-center justify-center gap-2">

                {/* Previous */}

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(1, page - 1)
                    )
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-[#080808] px-4 text-xs text-white/60 transition-colors hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >

                  <ChevronLeft size={14} />

                  Prev

                </motion.button>

                {/* Pages */}

                {Array.from(
                  { length: totalPages },
                  (_, i) => i + 1
                ).map((page) => (

                  <motion.button
                    key={page}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-10 min-w-10 items-center justify-center rounded-lg border text-xs font-medium transition-colors ${
                      currentPage === page
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-white/10 bg-[#080808] text-white/60 hover:border-white/25 hover:text-white"
                    }`}
                  >

                    {page}

                  </motion.button>

                ))}

                {/* Next */}

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-[#080808] px-4 text-xs text-white/60 transition-colors hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                >

                  Next

                  <ChevronRight size={14} />

                </motion.button>

              </div>

              {/* Page info */}

              <p className="mt-5 text-[10px] uppercase tracking-wider text-white/40">

                Page {currentPage} of {totalPages}

                <span className="mx-2 text-white/20">
                  ·
                </span>

                {filteredBlogs.length} Articles

              </p>

            </motion.div>

          )}

        </div>

      </section>

    </main>
  );
};

export default BlogsPage;
