import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
function New() {
  return (
    <div>
      <div className="row">
        <h1 className="text-center">新增小鼠品系:</h1>
        <div className="col-md-6 offset-md-3">
          <Form
            action="/strains"
            method="POST"
            noValidate
            className="validated-form"
          >
            <Form.Group className="mb-3">
              <Form.Label for="dept">單位:</Form.Label>
              <Form.Control
                type="text"
                id="dept"
                name="strain[dept]"
                required
              />
              <div className="valid-feedback">looks good!</div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label for="strain">品系名稱:</Form.Label>
              <Form.Control
                type="text"
                id="strain"
                name="strain[strain]"
                required
              />
              <div className="valid-feedback">looks good!</div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label for="abbr">品系縮寫:</Form.Label>
              <Form.Control
                type="text"
                id="abbr"
                name="strain[abbr]"
                required
              />
              <div className="valid-feedback">looks good!</div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label for="iacuc_no">IACUC編號:</Form.Label>
              <Form.Control
                type="text"
                id="iacuc_no"
                name="strain[iacuc_no]"
                required
              />
              <div className="valid-feedback">looks good!</div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label for="EXP">計畫期限:</Form.Label>
              <Form.Control type="date" id="EXP" name="strain[EXP]" required />
              <div className="valid-feedback">looks good!</div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>採樣基因列表:</Form.Label>
              <div id="gene-fields"></div>
              <Button id="add-gene-btn" type="button" className=" btn-primary">
                新增採樣基因
              </Button>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="form-label">使用者列表:</Form.Label>
              <div id="user-fields"></div>
              <Button id="add-user-btn" type="button" className="btn-primary">
                新增使用者
              </Button>
            </Form.Group>
            <div className="mb-3">
              <Button className=" btn-success">新增小鼠品系</Button>
            </div>
          </Form>
        </div>
      </div>
      <a href="/strains">返回所有品系資訊</a>
      <script src="/javascripts/addForm.js"></script>
    </div>
  );
}

export default New;
