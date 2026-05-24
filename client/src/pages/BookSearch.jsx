import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Search, Book as BookIcon, Loader2, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function BookSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setLoading(true);
    
    try {
      const response = await axios.get(`/books/search?q=${encodeURIComponent(query)}`);
      setResults(response.data);
    } catch (err) {
      toast.error('Failed to fetch books. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBook = async (book) => {
    try {
      const response = await axios.post('/books/save', book);
      const savedBook = response.data.book;
      navigate(`/plan/new/${savedBook._id}`);
    } catch (err) {
      toast.error('Failed to save the book.');
      console.error(err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto p-6 md:p-12 min-h-[80vh]"
    >
      <div className="mb-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>
      </div>

      <div className="text-center mb-16 relative">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-blue-600 font-semibold mb-6"
        >
          <Sparkles className="w-4 h-4" /> Discovery Engine
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6"
        >
          Find Your Next <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Obsession</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-500 max-w-2xl mx-auto"
        >
          Search millions of titles and let AI craft the perfect roadmap to master its concepts.
        </motion.p>
      </div>

      <motion.form 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleSearch} 
        className="relative max-w-3xl mx-auto mb-16 z-20"
      >
        <div className="relative flex items-center group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <div className="relative flex w-full items-center bg-white/60 backdrop-blur-xl border border-white/80 shadow-2xl rounded-2xl overflow-hidden p-2">
            <Search className="ml-4 text-slate-400 w-6 h-6" />
            <input
              type="text"
              className="w-full pl-4 pr-4 py-4 bg-transparent text-xl text-slate-800 placeholder-slate-400 outline-none"
              placeholder="Search by title, author, or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-4 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-colors font-bold disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
            </button>
          </div>
        </div>
      </motion.form>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
          >
            {results.map((book) => (
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                key={book.googleBooksId} 
                className="glass-panel p-6 rounded-3xl flex flex-col h-full group"
              >
                <div className="flex gap-5 mb-5 relative">
                  {book.thumbnail ? (
                    <img src={book.thumbnail} alt={book.title} className="w-28 h-40 object-cover rounded-xl shadow-lg group-hover:shadow-blue-500/30 transition-shadow" />
                  ) : (
                    <div className="w-28 h-40 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-slate-400 shadow-inner">
                      <BookIcon className="w-10 h-10 opacity-50" />
                    </div>
                  )}
                  <div className="flex-1 pt-2">
                    <h3 className="font-extrabold text-lg text-slate-900 line-clamp-2 leading-tight mb-2" title={book.title}>{book.title}</h3>
                    <p className="text-sm font-semibold text-blue-600 line-clamp-2">{book.author}</p>
                  </div>
                </div>
                <div className="flex-1 mb-6">
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                    {book.description || "No description available for this book. Journey into the unknown."}
                  </p>
                </div>
                <button 
                  onClick={() => handleSelectBook(book)}
                  className="w-full py-3 bg-white border border-slate-200 text-slate-800 rounded-xl font-bold group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  Create Plan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
