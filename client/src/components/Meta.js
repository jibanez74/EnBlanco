import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Bienvenidos a En Blanco',
  description: 'Moda boricua',
  keywords: 'tshirts, ropa, moda, boricua',
};

export default Meta;
