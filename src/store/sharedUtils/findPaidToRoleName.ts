import constructionRoles from "@/filterData/contructionRolesData";

const findPaidToRoleName = (id: string) => {
    return constructionRoles.filter((role) => {
      return String(role.id) === id;
    });
  };

  export default findPaidToRoleName;