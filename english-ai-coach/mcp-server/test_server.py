import json, os, tempfile
os.environ["COACH_PROGRESS_FILE"] = os.path.join(tempfile.mkdtemp(), "p.json")
import server

def test_16_units_in_order():
    ids = [u["id"] for u in server._units()]
    assert ids == [f"U{i:02d}" for i in range(1, 17)]

def test_every_quiz_answer_valid():
    for u in server._units():
        assert len(u["vocabulary"]) >= 8
        for q in u["quiz"]:
            assert 0 <= q["answer_index"] < len(q["options"])

def test_flow():
    q = server.make_quiz("1", 4)[0]
    assert "answer_index" not in q
    r = server.check_answer("U01", q["index"], 0)
    assert "explanation_pt" in r
    server.record_attempt("U01", 4, 4)
    p = server.get_progress()
    assert p["next_unit"] == "U02"
