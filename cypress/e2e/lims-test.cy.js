describe("Helix LIMS 端到端測試", () => {
  it("應該可以透過ui登入", () => {
    cy.visit("/login");

    cy.get("input[name='username']").type("testuser@gmail.com");
    cy.get("input[name='password']").type("testuser");
    cy.get("button[type='submit']").click();

    cy.url({ timeout: 10000 }).should("include", "/dashboard"); // 等待跳轉
    cy.contains("數據查詢").should("be.visible");
  });

  it("應該能夠新增小鼠品系", () => {
    cy.visit("/login");

    cy.get("input[name='username']").type("testuser@gmail.com");
    cy.get("input[name='password']").type("testuser");
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/dashboard");
    cy.visit("/strains/new");

    cy.get("input[name='strain']").type("NewStrain001");
    cy.get("input[name='dept']").type("生技研究所");
    cy.get("input[name='abbr']").type("NS001");
    cy.get("input[name='iacuc_no']").type("12345");
    cy.get("input[name='EXP']").type("2027-02-20");
    cy.intercept("POST", "**/api/strains").as("createStrain");
    cy.get("button").contains("提交表單").click();
    cy.wait("@createStrain").its("response.statusCode").should("eq", 200);
    cy.contains("成功新增特殊品系資訊").should("be.visible");

    cy.url().should("include", "/strains/index");
    cy.contains("NewStrain001").should("be.visible");
  });
});
