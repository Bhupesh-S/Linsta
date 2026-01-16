import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post } from '../utils/types';

interface ArticleContextType {
  userArticles: Post[];
  addArticle: (article: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'shares'>) => Promise<void>;
  clearArticles: () => Promise<void>;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

const STORAGE_KEY = '@linsta_user_articles';

export const ArticleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userArticles, setUserArticles] = useState<Post[]>([]);

  // Load articles from AsyncStorage on mount
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const articlesJson = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('[ArticleContext] Loading articles from storage:', articlesJson);
      if (articlesJson) {
        const articles: Post[] = JSON.parse(articlesJson);
        console.log('[ArticleContext] Loaded articles:', articles.length);
        setUserArticles(articles);
      } else {
        console.log('[ArticleContext] No articles found in storage');
      }
    } catch (error) {
      console.error('Error loading articles:', error);
    }
  };

  const addArticle = async (articleData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments' | 'shares'>) => {
    try {
      console.log('[ArticleContext] Adding article:', articleData);
      const newArticle: Post = {
        ...articleData,
        id: `user_article_${Date.now()}`,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        isArticle: true,
      };

      console.log('[ArticleContext] New article created:', newArticle);
      const updatedArticles = [newArticle, ...userArticles];
      console.log('[ArticleContext] Updated articles count:', updatedArticles.length);
      setUserArticles(updatedArticles);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedArticles));
      console.log('[ArticleContext] Article saved to storage');
    } catch (error) {
      console.error('Error adding article:', error);
      throw error;
    }
  };

  const clearArticles = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUserArticles([]);
      console.log('[ArticleContext] All articles cleared');
    } catch (error) {
      console.error('Error clearing articles:', error);
    }
  };

  return (
    <ArticleContext.Provider value={{ userArticles, addArticle, clearArticles }}>
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
};
