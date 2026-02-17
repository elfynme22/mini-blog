import express from "express";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// View engine
app.set("view engine", "ejs");

// In-memory posts (DB yok)
let posts = [];
// Basit ID için sayaç (istersen Date.now() da kullanabilirsin)
let nextId = 1;

// HOME: tüm postları göster + create formu
app.get("/", (req, res) => {
  res.render("index", { posts });
});

// CREATE: yeni post ekle
app.post("/posts", (req, res) => {
  const { title, content } = req.body;

  // basit validasyon
  if (!title?.trim() || !content?.trim()) {
    return res.status(400).send("Title ve content boş olamaz.");
  }

  const newPost = {
    id: nextId++,
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date().toLocaleString(),
  };

  posts.unshift(newPost); // en üstte görünsün
  res.redirect("/");
});

// VIEW ONE: tek post sayfası (post.ejs)
app.get("/posts/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((p) => p.id === id);

  if (!post) return res.status(404).send("Post bulunamadı.");
  res.render("post", { post });
});

// EDIT PAGE: edit formu
app.get("/posts/:id/edit", (req, res) => {
  const id = Number(req.params.id);
  const post = posts.find((p) => p.id === id);

  if (!post) return res.status(404).send("Post bulunamadı.");
  res.render("edit", { post });
});

// UPDATE: postu güncelle
app.post("/posts/:id/update", (req, res) => {
  const id = Number(req.params.id);
  const { title, content } = req.body;

  const post = posts.find((p) => p.id === id);
  if (!post) return res.status(404).send("Post bulunamadı.");

  if (!title?.trim() || !content?.trim()) {
    return res.status(400).send("Title ve content boş olamaz.");
  }

  post.title = title.trim();
  post.content = content.trim();

  res.redirect("/");
});

// DELETE: postu sil
app.post("/posts/:id/delete", (req, res) => {
  const id = Number(req.params.id);
  posts = posts.filter((p) => p.id !== id);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
