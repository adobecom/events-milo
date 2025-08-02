export const META_REG = /\[\[(.*?)\]\]/g;
export const ICON_REG = /@@(.*?)@@/g;
export const SUSI_OPTIONS = {
  dctx_id: {
    stage: 'v:2,s,bg:milo,51364e80-648b-11ef-9bf6-ad6724e2c153',
    prod: 'v:2,s,bg:milo,b719a8b0-6ba6-11ef-933e-7f38920b05fd',
  },
};
export const REDIRECT_MAP = {
  CreativeCloud: { pathname: '/error-pages/404' },
  ExprienceCloud: {
    origin: 'https://business.adobe.com',
    pathname: '/resources/404.html',
  },
};
