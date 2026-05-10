from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

from .config import DOCS_DIR, EMBEDDING_MODEL, OPENAI_API_KEY, TOP_K

_retriever = None


def _load_documents() -> list[Document]:
    docs = []
    for path in sorted(DOCS_DIR.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        docs.append(Document(page_content=text, metadata={"source": path.name}))
    return docs


def _split_documents(docs: list[Document]) -> list[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=80,
        separators=["\n## ", "\n### ", "\n\n", "\n", " ", ""],
    )
    return splitter.split_documents(docs)


def get_retriever():
    global _retriever
    if _retriever is not None:
        return _retriever

    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is missing. Add it to your .env file.")

    raw_docs = _load_documents()
    if not raw_docs:
        raise RuntimeError(f"No knowledge base documents found in {DOCS_DIR}")

    chunks = _split_documents(raw_docs)
    embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL, api_key=OPENAI_API_KEY)
    store = FAISS.from_documents(chunks, embeddings)
    _retriever = store.as_retriever(search_kwargs={"k": TOP_K})
    return _retriever
