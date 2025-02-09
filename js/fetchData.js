
const userQuery = `
{
  user {
    login
    email
    attrs
    campus
  }
  xpTransactions: transaction(where: {type: {_eq: "xp"}, eventId: {_eq: 41}}) {
    amount
    createdAt
    object {
      name
      type
    }
  }
  upDownTransactions: transaction(where: {type: {_in: ["up", "down"]}}) {
    type
    amount
  }
  skillsTransactions: transaction(
    where: {type: {_regex: "^skill_"}}
    order_by: [{type: asc}, {createdAt: desc}]
    distinct_on: type
  ) {
    type
    amount
  }
  progress(where:{eventId : {_eq : 41},object:{type:{_eq : "project"}}}){
    object {
      name
    }
    isDone
    createdAt
  }
}`;

export async function fetchProfileData() {

    let jwt = localStorage.getItem('jwt');

    const response = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userQuery })
    });

    const { data } = await response.json();

    return data

}
