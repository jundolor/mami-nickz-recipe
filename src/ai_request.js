export async function getRecipeFromChefClaude(ingredientsArr){
    console.log(ingredientsArr)
  const res = await fetch('/.netlify/functions/anthropic', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ingredientsArr }),
  });

  let data;
  try {
    data = await res.json();
    console.log(data)

    //return data.text
  } catch (err) {
    console.log(err)
    //can I have data.text ='error markdown'
    throw new Error("Invalid JSON returned from server!");
  }

  if (!res.ok) {
    throw new Error(data.error || "Server error from Anthropic backend.");
  }
  

  return data.text;//in case of error, the error markdown is passed
}

export async function getRecipeFromMistral(ingredientsArr) {
  console.log(ingredientsArr)
  const res = await fetch('/.netlify/functions/mistral', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ingredientsArr }),
  });

  let data;
  try {
    data = await res.json();
    console.log(data)

    return data.text
  } catch (err) {
    console.log(err)
    throw new Error("Invalid JSON returned from server!");
    
  }
/*
  if (!res.ok) {
    throw new Error(data.error || "Server error from Mistral backend.");
  }

  return data.text;
  */
}