"use client";

import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import TeacherActivity from './teacher-activity';

export default function TeacherActivityMount() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLDivElement>('.teacher-activity-placeholder');
    nodes.forEach((node) => {
      try {
        const data = JSON.parse(node.getAttribute('data-activity') || '{}');
        const container = document.createElement('div');
        node.replaceWith(container);
        const root = createRoot(container);
        root.render(React.createElement(TeacherActivity, { activity: data }));
      } catch (e) {
        // ignore
      }
    });
  }, []);

  return null;
}
