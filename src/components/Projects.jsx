import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, Star, GitFork, Sparkles, 
  FolderGit2, RefreshCw, Search, UserCheck, AlertCircle, Code2, GraduationCap, Layers
} from 'lucide-react';
import { GithubIcon as Github } from './Icons';
import { fetchUserRepositories, LANGUAGE_COLORS } from '../services/githubService';
import { personalInfo, academicProjects } from '../data/portfolioData';

export default function Projects() {
  const [activeTab, setActiveTab] = useState('academic'); // 'academic' | 'github'
  const [username, setUsername] = useState(personalInfo.githubUsername);
  const [inputUsername, setInputUsername] = useState(personalInfo.githubUsername);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const [repos, setRepos] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterLang, setFilterLang] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadRepositories = async (targetUser) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchUserRepositories(targetUser);
      setRepos(result.repos);
      setTotalCount(result.totalCount);
      if (result.error && result.repos.length === 0) {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to load repositories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepositories(username);
  }, [username]);

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      setUsername(inputUsername.trim());
      setShowUserSwitcher(false);
    }
  };

  const handleResetUser = () => {
    setInputUsername(personalInfo.githubUsername);
    setUsername(personalInfo.githubUsername);
    setShowUserSwitcher(false);
  };

  const availableLanguages = ['All', ...new Set(repos.map((r) => r.language).filter(Boolean))];

  const filteredRepos = repos.filter((repo) => {
    const matchesLang = filterLang === 'All' || repo.language === filterLang;
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLang && matchesSearch;
  });

  return (
    <section id="projects" className="py-16 sm:py-20 md:py-28 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/3 w-[300px] sm:w-[600px] h-[200px] sm:h-[300px] bg-brand-violet/10 blur-[100px] sm:blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-4 sm:right-10 w-48 sm:w-80 h-48 sm:h-80 bg-brand-cyan/10 blur-[80px] sm:blur-[110px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/20 text-brand-violet text-xs font-mono mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
            <span>PORTFOLIO & PROJECT DELIVERABLES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Featured Projects & Academic Works
          </h2>
          <p className="mt-3 sm:mt-4 text-slate-400 text-sm sm:text-base md:text-lg">
            Explore my featured SLIIT coursework engineering systems as well as live repositories fetched from the GitHub REST API.
          </p>

          {/* Main Tab Switcher: Academic vs Live GitHub */}
          <div className="mt-6 sm:mt-8 inline-flex flex-col sm:flex-row w-full sm:w-auto p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md gap-1.5">
            <button
              onClick={() => setActiveTab('academic')}
              className={`w-full sm:w-auto justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'academic'
                  ? 'bg-gradient-to-r from-brand-violet to-brand-cyan text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>SLIIT Academic Projects</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/20 text-white">
                {academicProjects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('github')}
              className={`w-full sm:w-auto justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'github'
                  ? 'bg-gradient-to-r from-brand-violet to-brand-cyan text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Github className="w-4 h-4" />
              <span>GitHub API Repositories</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/20 text-white">
                Live
              </span>
            </button>
          </div>
        </div>

        {/* Tab 1: SLIIT Academic Projects from CV */}
        {activeTab === 'academic' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8"
          >
            {academicProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl sm:rounded-3xl glass-card-hover p-5 sm:p-7 flex flex-col justify-between overflow-hidden border border-white/[0.08] hover:border-brand-violet/40 transition-all duration-300"
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-brand-violet/15 border border-brand-violet/30 text-[11px] sm:text-xs font-mono text-brand-cyan">
                      <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                      <span>{project.semester} • {project.institution}</span>
                    </div>

                    <a
                      href={project.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] transition-colors"
                      title="View on GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-brand-cyan transition-colors mb-1.5 sm:mb-2">
                    {project.title}
                  </h3>

                  <p className="text-[11px] sm:text-xs font-mono text-emerald-400 mb-2.5 sm:mb-3 font-semibold">
                    {project.tagline}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 sm:mb-6">
                    {project.description}
                  </p>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] sm:text-[11px] font-mono text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <a
                    href={project.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-violet group-hover:text-brand-cyan transition-colors"
                  >
                    <span>View Repository</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Tab 2: Live GitHub Repositories */}
        {activeTab === 'github' && (
          <div>
            {/* GitHub Connection Badge & Switcher */}
            <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] sm:text-xs font-mono text-slate-300 max-w-full">
                <Github className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                <span className="hidden xs:inline">Connected to GitHub:</span>
                <a
                  href={`https://github.com/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-violet font-semibold hover:underline truncate"
                >
                  @{username}
                </a>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-violet/20 text-brand-cyan shrink-0">
                  {totalCount} repos
                </span>
              </div>

              <button
                onClick={() => setShowUserSwitcher(!showUserSwitcher)}
                className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-slate-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                title="Test with another GitHub account"
              >
                <UserCheck className="w-3.5 h-3.5 text-brand-cyan" />
                <span>{showUserSwitcher ? 'Close' : 'Switch GitHub User'}</span>
              </button>

              <button
                onClick={() => loadRepositories(username)}
                disabled={loading}
                className="p-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                title="Refresh repositories"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-cyan' : ''}`} />
              </button>
            </div>

            {/* Interactive User Switcher Input Box */}
            <AnimatePresence>
              {showUserSwitcher && (
                <motion.form
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleUserSubmit}
                  className="mb-6 sm:mb-8 p-3 sm:p-4 max-w-md mx-auto rounded-2xl glass-card border border-brand-violet/40 flex flex-col xs:flex-row items-stretch xs:items-center gap-2 shadow-2xl"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputUsername}
                      onChange={(e) => setInputUsername(e.target.value)}
                      placeholder="Enter any GitHub username..."
                      className="w-full px-3.5 py-2 rounded-xl bg-dark-950 border border-white/[0.1] text-xs sm:text-sm text-white focus:outline-none focus:border-brand-cyan font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="submit"
                      className="flex-1 xs:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-brand-violet to-brand-cyan text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Load
                    </button>
                    {username !== personalInfo.githubUsername && (
                      <button
                        type="button"
                        onClick={handleResetUser}
                        className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-slate-300 transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setFilterLang(lang)}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                      filterLang === lang
                        ? 'bg-brand-violet text-white shadow-sm'
                        : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.05]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search repositories..."
                  className="w-full pl-9 pr-3 py-1.5 sm:py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-violet"
                />
              </div>
            </div>

            {/* Error notification banner if any */}
            {error && (
              <div className="mb-6 sm:mb-8 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
                  <span className="font-semibold">{error}</span>
                </div>
                <button
                  onClick={() => loadRepositories(username)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-mono font-medium transition-colors cursor-pointer"
                >
                  Retry Fetch
                </button>
              </div>
            )}

            {/* Loading Skeletons */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="h-60 sm:h-64 rounded-2xl bg-white/[0.02] border border-white/[0.05] p-5 sm:p-6 flex flex-col justify-between animate-pulse"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.05]" />
                        <div className="w-16 h-4 rounded bg-white/[0.05]" />
                      </div>
                      <div className="w-3/4 h-5 rounded bg-white/[0.05]" />
                      <div className="w-full h-12 rounded bg-white/[0.03]" />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
                      <div className="w-20 h-4 rounded bg-white/[0.05]" />
                      <div className="w-16 h-4 rounded bg-white/[0.05]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dynamic Project Cards Grid */}
            {!loading && filteredRepos.length > 0 && (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                {filteredRepos.map((repo, idx) => {
                  const langColor = LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Default;

                  return (
                    <motion.div
                      key={repo.id || repo.name}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      whileHover={{ y: -6 }}
                      className="group relative rounded-2xl glass-card-hover p-5 sm:p-6 flex flex-col justify-between overflow-hidden border border-white/[0.08] hover:border-brand-violet/40 transition-all duration-300"
                    >
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-violet to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div>
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <div className="p-2 sm:p-2.5 rounded-xl bg-brand-violet/10 border border-brand-violet/20 text-brand-violet group-hover:text-brand-cyan transition-colors">
                            <FolderGit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            {repo.homepage && (
                              <a
                                href={repo.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.08] transition-colors"
                                title="Live Demo"
                              >
                                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </a>
                            )}
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.08] transition-colors"
                              title="View Source Code on GitHub"
                            >
                              <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </a>
                          </div>
                        </div>

                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-base sm:text-lg font-bold text-white group-hover:text-brand-cyan transition-colors mb-2 line-clamp-1 break-words"
                        >
                          {repo.name}
                        </a>

                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3 mb-4 font-normal break-words">
                          {repo.description}
                        </p>

                        {repo.topics && repo.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-6">
                            {repo.topics.slice(0, 3).map((topic) => (
                              <span
                                key={topic}
                                className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-[10px] font-mono text-slate-400"
                              >
                                #{topic}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 sm:pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full inline-block"
                            style={{ backgroundColor: langColor }}
                          />
                          <span className="text-slate-300 font-medium text-[11px] sm:text-xs">{repo.language || 'Code'}</span>
                        </div>

                        <div className="flex items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs">
                          <span className="flex items-center gap-1 hover:text-amber-300 transition-colors" title="Stars">
                            <Star className="w-3.5 h-3.5 text-amber-400" />
                            <span>{repo.stargazers_count || 0}</span>
                          </span>
                          <span className="flex items-center gap-1 hover:text-brand-cyan transition-colors" title="Forks">
                            <GitFork className="w-3.5 h-3.5" />
                            <span>{repo.forks_count || 0}</span>
                          </span>
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {!loading && filteredRepos.length === 0 && (
              <div className="text-center py-12 sm:py-16 p-6 sm:p-8 rounded-2xl glass-card border border-white/[0.06] max-w-md mx-auto">
                <FolderGit2 className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white">No repositories found</h4>
                <p className="text-xs text-slate-400 mt-1">
                  No repositories matched your search query or language filter.
                </p>
                <button
                  onClick={() => {
                    setFilterLang('All');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-slate-200 cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* GitHub Direct Link Button */}
        <div className="mt-10 sm:mt-14 text-center">
          <a
            href={personalInfo.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.1] hover:border-brand-violet/40 text-xs sm:text-sm font-semibold text-white transition-all group max-w-full"
          >
            <Github className="w-4 h-4 text-brand-cyan shrink-0" />
            <span className="truncate">Explore All Repositories on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </a>
        </div>

      </div>
    </section>
  );
}
