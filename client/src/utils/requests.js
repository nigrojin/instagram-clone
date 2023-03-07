// 서버에 요청하는 함수 라이브러리
const server = process.env.REACT_APP_SERVER;

/* USER */
export async function createUser(email, fullName, username, password) {
	const res = await fetch(`${server}/users`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			email,
			fullName,
			username,
			password
		})
	});

	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}`);
	}

	return await res.json();
}

// 로그인
export async function signIn(email, password) {
	const res = await fetch(`${server}/user/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password })
	})

	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}`);
	}

	return await res.json();
}

// 정보 수정
export async function updateProfile(formData) {
	const res = await fetch(`${server}/user`, {
		method: "PUT",
		headers: { "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).token },
		body: formData
	})

	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}`);
	}

	return await res.json();
}

// 유저 검색
export async function searchUsers(username) {
	const res = await fetch(`${server}/users/?username=${username}`, {
		headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
	});

	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}`);
	}

	return await res.json();
}

// 이메일로 유저 검색
export async function doesEmailExists(email) {
	const res = await fetch(`${server}/users/?email=${email}`);

	if (!res.ok) {
		throw new Error(`${res.status} ${res.statusText}`);
	}

	const { userCount } = await res.json();

	return userCount > 0;
}

/* ARTICLES */

// 피드
export async function getFeed() {
  const res = await fetch(`${server}/feed`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 게시물 하나 가져오기
export async function getArticle(id) {
  const res = await fetch(`${server}/articles/${id}`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 게시물 생성
export async function createArticle(formData) {
  const res = await fetch(`${server}/articles`, {
    method: "POST",
    headers: { "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).token },
    body: formData
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 게시물 삭제
export async function deleteArticle(id) {
  const res = await fetch(`${server}/articles/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 좋아요
export async function favorite(id) {
  const res = await fetch(`${server}/articles/${id}/favorite`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 좋아요 취소
export async function unfavorite(id) {
  const res = await fetch(`${server}/articles/${id}/favorite`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

/* COMMENTS */

// 댓글 가져오기
export async function getComments(id) {
  const res = await fetch(`${server}/articles/${id}/comments`, {
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 댓글 생성
export async function createComment(id, content) {

  const res = await fetch(`${server}/articles/${id}/comments`, {
    method: "POST",
    headers: {
      "Authorization": 'Bearer ' + JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content })
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

// 댓글 삭제
export async function deleteComment(id) {
  const res = await fetch(`${server}/comments/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem("user")).token }
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }

  return await res.json();
}

/* PROFILES */