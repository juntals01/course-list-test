export type ArticleType = 'Company' | 'Master' | 'Site';

export type Article = {
  id: number;
  name: string;
  articleType: ArticleType;
  category: string;
  hasDragHandle: boolean;
  createdAt?: Date | null;
  deletedAt?: Date | null;
};

export type ArchivedArticle = {
  id: number;
  name: string;
  category: string;
  hasDragHandle: boolean;
};

export type SiteArticle = {
  id: number;
  name: string;
  site: string;
  category: string;
  isActive: boolean;
};

export type CompanyArticle = {
  id: number;
  name: string;
  category: string;
  reviewDate: string;
  isActive: boolean;
};

export type ArchivedCategory = {
  id: number;
  name: string;
  dateDeleted: string;
  isActive: boolean;
  hasDragHandle: boolean;
};

export type ActiveCategory = {
  id: number;
  name: string;
  categoryType: 'Company' | 'Site';
  hasDragHandle: boolean;
};
