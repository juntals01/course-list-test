'use client';

import { MOCK_ARTICLES } from '@/lib/mock-articles';
import ArticlesTableView from '@/components/policies/ArticlesTableView';

export default function AllArticlesPage() {
  return (
    <ArticlesTableView
      data={MOCK_ARTICLES}
      title="All Master Articles"
      subtitle="Published articles currently available and in use."
      showArticleType={true}
    />
  );
}
