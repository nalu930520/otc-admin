import Mock from "mockjs";

const List = [];
const count = 20;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@guid()",
      display_time: +Mock.Random.date("T"),
      author: "@name()",
      title: "@title",
      pageviews: "@float(1, 15, 0, 0)",
      "status|1": ["success", "pending"]
    })
  );
}

export default {
  getList: () => {
    return {
      total: List.length,
      items: List
    };
  }
};
