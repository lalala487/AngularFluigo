import { AppPage } from './app.po';

describe('frontend-web-application App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display correct title', () => {
    page.navigateTo();
    expect(page.getTitle()).toEqual('Flugio');
  });
});
